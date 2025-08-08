import '../lcars-workflow.css';

export const metadata = {
  title: 'LCARS Workflow System - AlexAI Star Trek Agile',
  description: 'Real-time collaboration workflow system with authentic Star Trek LCARS design',
};

export default function WorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lcars-workflow-layout">
      {children}
    </div>
  );
}
