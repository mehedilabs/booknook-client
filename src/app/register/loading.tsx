export default function RegisterLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EEF1EA] px-4 py-6">
      <div className="w-full max-w-sm animate-pulse overflow-hidden rounded-md border border-[#D3DACD] bg-white">
        <div className="h-1 bg-[#D9A441]" />

        <div className="p-5 sm:p-6">
          {/* Logo */}
          <div className="mb-4 flex items-center gap-2">
            <div className="size-7 rounded-sm bg-[#DDE4D8]" />
            <div className="h-5 w-24 rounded bg-[#DDE4D8]" />
          </div>

          {/* Heading */}
          <div className="mb-4 space-y-2">
            <div className="h-7 w-52 rounded bg-[#DDE4D8]" />
            <div className="h-3.5 w-full rounded bg-[#EDEFE9]" />
          </div>

          {/* Form fields */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((field) => (
              <div key={field} className="space-y-1.5">
                <div className="h-3.5 w-28 rounded bg-[#DDE4D8]" />
                <div className="h-10 w-full rounded-md border border-[#DDE4D8] bg-[#F6F8F3]" />
              </div>
            ))}

            <div className="h-3 w-64 rounded bg-[#EDEFE9]" />

            {/* Create account button */}
            <div className="h-10 w-full rounded-md bg-[#DDE4D8]" />
          </div>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="h-px w-full bg-[#DDE4D8]" />
            <div className="absolute h-4 w-24 bg-white" />
          </div>

          {/* Google button */}
          <div className="h-10 w-full rounded-md border border-[#DDE4D8] bg-[#F6F8F3]" />

          {/* Sign in link */}
          <div className="mt-4 flex justify-center gap-2">
            <div className="h-3.5 w-32 rounded bg-[#EDEFE9]" />
            <div className="h-3.5 w-12 rounded bg-[#DDE4D8]" />
          </div>
        </div>
      </div>
    </main>
  );
}
