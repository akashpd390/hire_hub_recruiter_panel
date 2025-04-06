


export default async function jobPostPage({params}) {


const { id } = await params;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Job Posts {id}</h1>
      <p>Welcome to the dashboard! Here you can manage your content, settings, and more.</p>
      {/* You can add more content here as needed */}
    </div>
  );
};