export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-12 pt-32 pb-8 transition-colors duration-500">
      <div className="max-w-5xl mx-0">
        <h1 className="text-3xl font-thin tracking-tight">Exams</h1>
        <div className="flex flex-col items-start">
          <button className="px-10 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-bold transition-colors duration-300 mt-5 mb-5">
            Add New Exam
          </button>
        </div>
        <div className="mt-2 space-y-6">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">BUSINESS ADMINISTRATION CORE</h2>
            </section>
            <section>
              <h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">BUSINESS MANAGEMENT + ADMINISTRATION</h2>
            </section>
            <section>
              <h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">ENTREPRENEURSHIP</h2>
            </section>
            <section>
              <h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">FINANCE</h2>
            </section>
            <section>
              <h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">HOSPITALITY + TOURISM</h2>
            </section>
            <section>
              <h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">MARKETING</h2>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
