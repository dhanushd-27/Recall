export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center h-[calc(100vh-4rem)] text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Recall</h1>
        <p className="text-muted-foreground">
          Select a topic from the sidebar to start reviewing your interview
          preparation materials.
        </p>
      </div>
    </div>
  );
}
