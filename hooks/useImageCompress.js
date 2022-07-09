import Resizer from "react-image-file-resizer";

function useImageCompress() {
    const compress = (old_file) => {
        return new Promise((resolve) => {
            Resizer.imageFileResizer(
                old_file,
                100,
                100,
                "PNG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file"
            );
        });
    }
    return {
        compress
    }
}

export default useImageCompress