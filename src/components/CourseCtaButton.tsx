'use client';

import { useContact } from '@/components/ClientLayout';

export function CourseCtaButton({ className }: { className?: string }) {
  const { openContactModal } = useContact();
  return (
    <button onClick={openContactModal} className={className}>
      Solicitar información
    </button>
  );
}
