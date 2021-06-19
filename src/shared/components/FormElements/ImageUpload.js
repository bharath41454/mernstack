import React, { useEffect, useRef, useState } from "react";
import Button from "../FormElements/Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = ({ target }) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (target.files && target.files.length === 1) {
      pickedFile = target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <React.Fragment>
      <div className='form-control'>
        <input
          type='file'
          ref={filePickerRef}
          id={props.id}
          style={{ display: "none" }}
          className=' '
          accept='.jpg,.png,.jpeg'
          onChange={pickedHandler}
        />
        <div className={`image-upload ${props.center && "center"}`}>
          <div className='image-upload__preview'>
            {previewUrl && <img src={previewUrl} alt='Preview' />}
            {!previewUrl && <p>Please pick an image.</p>}
          </div>
          <Button type='button' onClick={pickImageHandler}>
            Pick Image
          </Button>
        </div>
        {!isValid && <p>{props.errorText}</p>}
      </div>
    </React.Fragment>
  );
};

export default ImageUpload;
