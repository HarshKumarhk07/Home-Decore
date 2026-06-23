"use client";

import { useState, useTransition } from "react";
import { generateQuotationPDF } from "@/utils/pdfGenerator";
import {
  updateLeadStatus,
  addLeadNote,
  assignLeadEmployee,
  deleteLead,
} from "@/actions/leadActions";
import {
  Search,
  SlidersHorizontal,
  Download,
  Eye,
  Trash2,
  UserPlus,
  StickyNote,
  History,
  FileCheck,
  X,
  Phone,
  Mail,
  MapPin,
  Maximize2,
  Calendar,
  Clock,
  Coins,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface LeadsClientProps {
  initialLeads: any[];
  employees: any[];
  currentUser: {
    id: string;
    role: "super_admin" | "manager" | "employee";
    name: string;
  };
}

export default function LeadsClient({ initialLeads, employees, currentUser }: LeadsClientProps) {
  const [leads, setLeads] = useState<any[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  
  // Transition state for form submissions
  const [isPending, startTransition] = useTransition();

  // Dialog specific input states
  const [newNote, setNewNote] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const isSuperAdmin = currentUser.role === "super_admin";
  const isManager = currentUser.role === "manager" || isSuperAdmin;

  // Filter leads client-side for immediate responsive searches
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      search === "" ||
      lead.leadId.toLowerCase().includes(search.toLowerCase()) ||
      lead.customerName.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.email.toLowerCase().includes(search.toLowerCase());

    const matchesService = serviceFilter === "all" || lead.service === serviceFilter;
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesService && matchesStatus;
  });

  // Export leads to CSV utility
  const exportToCSV = () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads available to export.");
      return;
    }

    const headers = ["Lead ID", "Customer Name", "Phone", "Email", "Service", "City", "Address", "Property Type", "Area (Sq Ft)", "Budget (INR)", "Status", "Created Date"];
    const rows = filteredLeads.map((l) => [
      l.leadId,
      l.customerName,
      `="${l.phone}"`, // Format phone so Excel doesn't trim leading zeros
      l.email,
      l.service,
      l.city || "N/A",
      l.address.replace(/"/g, '""'), // Escape quotes
      l.propertyType || "N/A",
      l.area || "0",
      l.budget || "0",
      l.status,
      new Date(l.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Home_Decorater_Leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file exported successfully!");
  };

  // 1. Submit note addition
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    startTransition(async () => {
      const res = await addLeadNote(selectedLead.leadId, newNote);
      if (res.success) {
        toast.success("Note added!");
        
        // Update local state instantly
        const updatedNotes = [
          ...selectedLead.notes,
          { text: newNote, createdAt: new Date().toISOString(), createdBy: currentUser.name },
        ];
        const updatedLead = { ...selectedLead, notes: updatedNotes };
        setSelectedLead(updatedLead);
        setLeads((prev) => prev.map((l) => (l.leadId === selectedLead.leadId ? updatedLead : l)));
        setNewNote("");
      } else {
        toast.error(res.message || "Failed to add note.");
      }
    });
  };

  // 2. Submit status modification
  const handleUpdateStatus = () => {
    if (!selectedStatus) {
      toast.error("Please select a status first.");
      return;
    }
    startTransition(async () => {
      const res = await updateLeadStatus(selectedLead.leadId, selectedStatus as any, statusReason);
      if (res.success) {
        toast.success("Lead status updated successfully!");
        
        const updater = currentUser.name;
        const newTimelineEvent = {
          status: selectedStatus,
          notes: statusReason || `Status updated to ${selectedStatus}`,
          updatedAt: new Date().toISOString(),
          updatedBy: updater,
        };
        const newNoteEvent = {
          text: `Status updated to [${selectedStatus}]. Reason: ${statusReason || "None"}`,
          createdAt: new Date().toISOString(),
          createdBy: updater,
        };

        const updatedLead = {
          ...selectedLead,
          status: selectedStatus,
          timeline: [...selectedLead.timeline, newTimelineEvent],
          notes: [...selectedLead.notes, newNoteEvent],
        };
        
        setSelectedLead(updatedLead);
        setLeads((prev) => prev.map((l) => (l.leadId === selectedLead.leadId ? updatedLead : l)));
        setStatusReason("");
        setSelectedStatus("");
      } else {
        toast.error(res.message || "Failed to update status.");
      }
    });
  };

  // 3. Submit employee assignment
  const handleAssignEmployee = () => {
    if (!selectedEmployee) return;
    startTransition(async () => {
      const res = await assignLeadEmployee(selectedLead.leadId, selectedEmployee);
      if (res.success) {
        toast.success("Lead assigned successfully!");
        
        const empName = selectedEmployee === "unassigned" 
          ? null 
          : employees.find((e) => e._id === selectedEmployee)?.username || "Assigned Personnel";
        
        const updatedLead = {
          ...selectedLead,
          assignedEmployee: selectedEmployee === "unassigned" 
            ? null 
            : { _id: selectedEmployee, username: empName },
          timeline: [
            ...selectedLead.timeline,
            { status: selectedLead.status, notes: `Lead assigned to ${empName || "Unassigned"}`, updatedAt: new Date().toISOString(), updatedBy: currentUser.name }
          ],
          notes: [
            ...selectedLead.notes,
            { text: `Employee assignment changed to: ${empName || "Unassigned"}`, createdAt: new Date().toISOString(), createdBy: currentUser.name }
          ]
        };

        setSelectedLead(updatedLead);
        setLeads((prev) => prev.map((l) => (l.leadId === selectedLead.leadId ? updatedLead : l)));
        setSelectedEmployee("");
      } else {
        toast.error(res.message || "Failed to assign lead.");
      }
    });
  };

  // 4. Submit Lead Deletion
  const handleDeleteLead = (leadId: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await deleteLead(leadId);
      if (res.success) {
        toast.success("Lead deleted successfully!");
        setLeads((prev) => prev.filter((l) => l.leadId !== leadId));
        setSelectedLead(null);
      } else {
        toast.error(res.message || "Failed to delete lead.");
      }
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "Contacted": return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
      case "Inspection Scheduled": return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "Quotation Sent": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Negotiation": return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "Confirmed": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Work Started": return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      case "Completed": return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "Rejected": return "bg-red-500/10 text-red-400 border border-red-500/20";
      default: return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
        <div className="relative flex-1 min-w-[280px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by ID, Customer name, Phone, or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Service filter */}
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">All Services</option>
              <option value="Waterproofing">Waterproofing</option>
              <option value="Wooden Flooring">Wooden Flooring</option>
              <option value="PVC (Polyvinyl Chloride)">PVC (Polyvinyl Chloride)</option>
              <option value="General">General Inquiries</option>
            </select>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Inspection Scheduled">Inspection Scheduled</option>
            <option value="Quotation Sent">Quotation Sent</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Work Started">Work Started</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* CSV exporter */}
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="border-slate-800 text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Lead ID</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
              {filteredLeads.map((lead) => (
                <tr key={lead.leadId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-accent">{lead.leadId}</td>
                  <td className="px-6 py-4 font-semibold text-white">{lead.customerName}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs text-slate-400">
                      <span>{lead.phone}</span>
                      <span>{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-primary-light/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-medium">
                      {lead.service}
                    </span>
                  </td>
                  <td className="px-6 py-4">{lead.city || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getStatusBadgeClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      onClick={() => {
                        setSelectedLead(lead);
                        setSelectedStatus(lead.status);
                      }}
                      size="sm"
                      className="bg-slate-850 hover:bg-primary border border-slate-700 hover:border-primary/25 text-white rounded-lg px-3 py-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-20 text-slate-500 font-medium bg-slate-900">
            No inquiry records match the active search filters.
          </div>
        )}
      </div>

      {/* Detailed View Lightbox */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="sm:max-w-5xl bg-slate-900 border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader className="border-b border-slate-800 pb-4 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="font-serif text-xl sm:text-2xl font-bold text-white">
                Lead Details - <span className="text-accent">{selectedLead?.leadId}</span>
              </DialogTitle>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
                Owner: {selectedLead?.customerName}
              </p>
            </div>
          </DialogHeader>

          {selectedLead && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
              {/* Parameters List (Left 2 Columns) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Parameter Cards */}
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Phone Number</p>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedLead.phone}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Email Address</p>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedLead.email}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">City & Address</p>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedLead.city || "N/A"}, {selectedLead.address}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center space-x-3">
                    <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Required Service</p>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedLead.service}</p>
                    </div>
                  </div>
                  {selectedLead.area && (
                    <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center space-x-3">
                      <Maximize2 className="w-4 h-4 text-accent shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Total Area</p>
                        <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedLead.area} Sq Ft</p>
                      </div>
                    </div>
                  )}
                  {selectedLead.budget && (
                    <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center space-x-3">
                      <Coins className="w-4 h-4 text-accent shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Est. Budget</p>
                        <p className="text-sm font-semibold text-slate-200 mt-0.5">₹{selectedLead.budget.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  )}
                  {selectedLead.preferredDate && (
                    <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-accent shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Preferred Visit</p>
                        <p className="text-sm font-semibold text-slate-200 mt-0.5">
                          {new Date(selectedLead.preferredDate).toLocaleDateString()} at {selectedLead.preferredTime}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message block */}
                {selectedLead.message && (
                  <div className="p-5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Message</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">{selectedLead.message}</p>
                  </div>
                )}

                {/* Lead Image Uploads */}
                {selectedLead.images && selectedLead.images.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Attached Site Photos</h4>
                    <div className="flex flex-wrap gap-4">
                      {selectedLead.images.map((img: string, i: number) => (
                        <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-800 shadow-sm block group cursor-zoom-in">
                          <img src={img} alt="Site" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline History Component */}
                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center">
                    <History className="w-4 h-4 mr-2 text-accent" /> Lead Activity Timeline
                  </h4>
                  <div className="pl-4 space-y-4 relative border-l-2 border-slate-800 ml-3">
                    {selectedLead.timeline.map((event: any, i: number) => (
                      <div key={event._id || i} className="relative pl-6">
                        <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 bg-accent border-2 border-slate-900 rounded-full"></span>
                        <div className="space-y-1">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeClass(event.status)}`}>
                            {event.status}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-300">{event.notes}</p>
                          <p className="text-[10px] text-slate-500">
                            Updated by {event.updatedBy} on {new Date(event.updatedAt).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CRM Actions Sidebar (Right Column) */}
              <div className="space-y-6">
                {/* Status Updater */}
                <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-accent" /> Update Lead Status
                  </h4>
                  
                  <div className="space-y-3">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Inspection Scheduled">Inspection Scheduled</option>
                      <option value="Quotation Sent">Quotation Sent</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Work Started">Work Started</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Reason / timeline notes..."
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent"
                    />

                    <Button
                      onClick={handleUpdateStatus}
                      disabled={isPending}
                      className="w-full bg-primary hover:bg-primary-hover text-white text-xs py-2 rounded-xl"
                    >
                      Update Status
                    </Button>
                  </div>
                </div>



                {/* PDF Quotation & Deletion Block */}
                <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                  <Button
                    onClick={() => generateQuotationPDF(selectedLead)}
                    className="w-full bg-accent hover:bg-accent-hover text-dark font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Generate Quotation</span>
                  </Button>

                  {isSuperAdmin && (
                    <Button
                      onClick={() => handleDeleteLead(selectedLead.leadId)}
                      variant="outline"
                      className="w-full border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl py-2.5 text-xs flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Lead Log</span>
                    </Button>
                  )}
                </div>

                {/* Internal Notes log */}
                <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                    <StickyNote className="w-4 h-4 mr-2 text-accent" /> Internal Audit Notes
                  </h4>

                  {/* Notes Feed */}
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                    {selectedLead.notes.map((note: any, i: number) => (
                      <div key={note._id || i} className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-1 text-xs">
                        <p className="text-slate-300 leading-relaxed">{note.text}</p>
                        <p className="text-[10px] text-slate-500 text-right">
                          - {note.createdBy} at {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add Note form */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/85">
                    <textarea
                      placeholder="Add internal auditor note..."
                      rows={2}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <Button
                      onClick={handleAddNote}
                      disabled={isPending || !newNote.trim()}
                      className="w-full bg-slate-850 hover:bg-slate-850 border border-slate-700 text-white text-xs py-2 rounded-xl"
                    >
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
