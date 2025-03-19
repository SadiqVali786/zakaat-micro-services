import { Image, Upload, Video } from "@repo/imagekit";

const ImagekitExamplesPage = () => {
  return (
    <div>
      <Image path="default-image.jpg" className="h-10" />
      <Video path="sample-video.mp4" className="h-10" />
      <Upload>
        <button>Upload Bro</button>
      </Upload>
    </div>
  );
};

export default ImagekitExamplesPage;
