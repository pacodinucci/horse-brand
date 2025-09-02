"use client";

import { useState, useEffect } from "react";
// import Image from "next/image";
import {
  CldUploadButton,
  //   CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Plus } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean;
}

export const ImageUpload = ({
  //   value,
  onChange,
}: //   disabled,
ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      <CldUploadButton
        onSuccess={(results) => {
          const info = Array.isArray(results)
            ? results[0]?.info
            : results?.info;
          if (typeof info === "object" && info?.secure_url) {
            onChange(info.secure_url);
          }
        }}
        options={{
          maxFiles: 10,
          maxFileSize: 25 * 1024 * 1024,
          multiple: true,
        }}
        uploadPreset="horse brand"
      >
        <div className="p-6 border-4 border-dashed border-gray-300 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center cursor-pointer">
          <div className="relative">
            <Plus color="gray" />
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};
