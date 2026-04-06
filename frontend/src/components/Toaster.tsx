import { Toaster } from 'sonner';

export default function CustomToaster() {
  return (
    <Toaster
      position="top-center"
      expand={true}
      duration={2000}
      visibleToasts={5}
      theme="dark"
      offset="20px"
      toastOptions={{
        classNames: {
          toast: `group bg-black/80 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(79,57,246,0.2)] text-white rounded-xl p-4`,
          title: 'text-white font-medium text-sm',
          description: 'text-blue-100 text-xs',
          icon: 'text-white',
          actionButton: 'bg-white text-[#4f39f6] font-bold px-3 py-1 rounded-md',
          cancelButton: 'bg-zinc-800 text-white px-3 py-1 rounded-md',
          success: 'border-green-500/50', 
          error: 'border-red-500/50',
        },
      }}
    />
  );
}