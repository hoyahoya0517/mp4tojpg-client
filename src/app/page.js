"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useDropzone } from "react-dropzone";
import { FaCloudArrowUp } from "react-icons/fa6";
import { FaRegFileVideo } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [sendVideo, setSendVideo] = useState(null);
  const [sendReady, setSendReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleSubmit = async (file) => {
    let formData = new FormData();
    formData.append("video", sendVideo);
    try {
      const data = await fetch("http://localhost:8080/video", {
        method: "POST",
        headers: {},
        body: formData,
      });
      const json = await data.json();
      console.log(json);
    } catch (error) {
      setErrorMessage("Something went wrong, please try again");
      setSendReady(false);
      setTimeout(() => {
        setSendVideo(null);
      }, 600);
    }
  };
  const onDrop = (data) => {
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
    if (data[0].size > MAX_VIDEO_SIZE) {
      setErrorMessage("Please add file that is 100MB or less");
      setSendReady(false);
      setTimeout(() => {
        setSendVideo(null);
      }, 600);
      return;
    }
    setErrorMessage(null);
    setSendVideo(data[0]);
    setTimeout(() => {
      setSendReady(true);
    }, 600);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/mp4": [".mp4"] },
  });
  return (
    <div className={styles.home}>
      <div className={styles.uploadWrapper}>
        <AnimatePresence>
          {!sendVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.7, ease: "easeIn" },
              }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className={styles.upload}
              {...getRootProps()}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.7, ease: "easeIn" },
                }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                className={styles.uploadIcon}
              >
                <FaCloudArrowUp color="white" size={170} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.6, duration: 0.7, ease: "easeIn" },
                }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                className={styles.uplaodDetail}
              >
                <span>Upload your video</span>
              </motion.div>
              <input {...getInputProps()} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {sendReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.7, ease: "easeIn" },
              }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className={styles.upload}
              {...getRootProps()}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.7, ease: "easeIn" },
                }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                className={styles.uploadIcon}
              >
                <FaRegFileVideo color="white" size={170} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.6, duration: 0.7, ease: "easeIn" },
                }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                className={styles.uplaodDetail}
              >
                <span>Upload successful! Start task</span>
              </motion.div>
              <input {...getInputProps()} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              onClick={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.5, ease: "easeIn" },
              }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className={styles.errorMessage}
            >
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {sendReady && (
          <motion.div
            onClick={handleSubmit}
            initial={{ top: "50%" }}
            animate={{
              top: "87.5%",
              transition: { delay: 0.6, duration: 1, ease: "backInOut" },
            }}
            exit={{ top: "50%", transition: { duration: 0.5 } }}
            className={styles.start}
          >
            <span>start</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
