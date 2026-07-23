"use client";

import { use } from "react";
import SubmissionsManager from "@/components/forms/SubmissionsManager";

export default function OwnedSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <SubmissionsManager
      formId={id}
      backHref={`/mis-formularios/${id}/editar`}
      notFoundHref="/mis-formularios"
    />
  );
}
