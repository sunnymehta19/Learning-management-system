import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor/instructorContext";
import { mediaUploadService } from "@/services";
import { useContext, useRef } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const replaceImageInputRef = useRef(null);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  function handleReplaceImageClick() {
    replaceImageInputRef.current.value = "";
    replaceImageInputRef.current.click();
  }

  return (
    <Card className="bg-zinc-900 border border-zinc-800 text-white">
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div>
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>
      <CardContent>
        {courseLandingFormData?.image ? (
          <div className="relative">
            <img
              src={courseLandingFormData.image}
              className="w-full rounded-md object-contain"
              alt="Course thumbnail"
            />
            {/* Hidden input for replacing the image */}
            <input
              ref={replaceImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUploadChange}
            />
            <Button
              onClick={handleReplaceImageClick}
              disabled={mediaUploadProgress}
              size="sm"
              className="absolute top-2 right-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-600 text-white hover:bg-zinc-700"
            >
              {mediaUploadProgress ? "Uploading..." : "Replace Image"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
              className="mb-4 bg-zinc-900 border-zinc-700 text-white file:text-white file:bg-zinc-800 file:border-0 file:px-2 file:mr-4 file:rounded-md file:hover:bg-zinc-700"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;