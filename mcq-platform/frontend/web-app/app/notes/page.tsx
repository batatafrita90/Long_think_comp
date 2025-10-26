import { createClient } from '@/utils/supabase/server';

export default async function NotesPage() {
  const supabase = createClient();
  const { data: notes, error } = await supabase.from('notes').select();

  if (error) {
    console.error('[notes] failed to fetch notes', error);
    return <p>Could not load notes.</p>;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
      <header>
        <h1 className="text-3xl font-semibold">Notes</h1>
        <p className="text-sm text-neutral-500">
          Data served from Supabase via server component fetch.
        </p>
      </header>
      <section className="overflow-x-auto rounded border border-neutral-200 bg-white p-4 shadow-sm">
        <pre className="text-sm leading-6 text-neutral-800">
          {JSON.stringify(notes ?? [], null, 2)}
        </pre>
      </section>
    </main>
  );
}
