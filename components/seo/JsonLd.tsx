// Renders one or more JSON-LD structured-data blocks.
// Pass a single schema object or an array; each is emitted as its own
// <script type="application/ld+json"> tag.

export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

export default JsonLd;
