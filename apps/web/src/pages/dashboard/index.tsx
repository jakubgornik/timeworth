import Layout from "@/components/layout";

export default function DashboardPage() {
  return (
    <Layout>
      <header className="px-4 md:px-0 md:pl-4 h-16 py-4 w-full border-b bg-primary">
        <h1 className="text-2xl font-bold">Dashboard Page</h1>
      </header>
      <div className="md:px-2 md:py-2 w-full h-full flex justify-center items-center">
        <h1 className="text-2xl font-bold">Dashboard Page content</h1>
      </div>
    </Layout>
  );
}
