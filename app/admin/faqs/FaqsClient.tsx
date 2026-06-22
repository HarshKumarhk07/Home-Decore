"use client";

import { useState, useTransition } from "react";
import { addFaq, removeFaq } from "@/actions/cmsActions";
import { toast } from "sonner";
import { Plus, Trash2, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FaqsClientProps {
  initialFaqs: any[];
}

export default function FaqsClient({ initialFaqs }: FaqsClientProps) {
  const [faqs, setFaqs] = useState<any[]>(initialFaqs);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // New FAQ Form inputs
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("general");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error("Please fill in both question and answer.");
      return;
    }

    startTransition(async () => {
      const res = await addFaq({ question, answer, category });
      if (res.success) {
        toast.success("FAQ created!");
        
        // Fetch new state or insert locally
        setFaqs((prev) => [
          { question, answer, category, createdAt: new Date().toISOString() },
          ...prev,
        ]);
        
        setQuestion("");
        setAnswer("");
        setIsOpen(false);
      } else {
        toast.error(res.message || "Failed to create FAQ.");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    startTransition(async () => {
      const res = await removeFaq(id);
      if (res.success) {
        toast.success("FAQ deleted!");
        setFaqs((prev) => prev.filter((f) => f._id !== id));
      } else {
        toast.error(res.message || "Failed to delete FAQ.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-400">Manage Q&A lists featured on public pages</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-4 py-2 text-xs flex items-center space-x-1.5 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Create FAQ</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-3xl p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-bold text-white">New FAQ Question</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Question</label>
                <input
                  type="text"
                  placeholder="E.g., What is your service warranty?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="general">General</option>
                  <option value="waterproofing">Waterproofing</option>
                  <option value="wooden-flooring">Wooden Flooring</option>
                  <option value="pvc">PVC (Polyvinyl Chloride)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detailed Answer</label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed answer description..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-accent hover:bg-accent-hover text-dark font-bold py-2.5 rounded-xl text-xs flex items-center justify-center cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Create FAQ Card"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq) => (
          <div key={faq._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[9px] bg-primary-light/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {faq.category}
              </span>
              <h4 className="font-serif font-bold text-white text-base leading-snug flex items-start">
                <HelpCircle className="w-5 h-5 mr-2 text-accent shrink-0 mt-0.5" />
                {faq.question}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-7">{faq.answer}</p>
            </div>
            {faq._id && (
              <Button
                onClick={() => handleDelete(faq._id)}
                size="icon"
                variant="ghost"
                className="text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl shrink-0 h-10 w-10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="text-center py-20 text-slate-500 font-medium bg-slate-900 border border-slate-800 rounded-2xl col-span-2">
            No FAQs added. Click 'Create FAQ' to add questions.
          </div>
        )}
      </div>
    </div>
  );
}
