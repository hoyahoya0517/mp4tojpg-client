"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import styles from "./page.module.css";
import { useDropzone } from "react-dropzone";
import { FaCloudArrowUp } from "react-icons/fa6";
import { FaRegFileVideo } from "react-icons/fa6";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrthographicCamera,
  ScrollControls,
  useAspect,
  useScroll,
} from "@react-three/drei";

function Scene(props) {
  const { urlArray } = props;
  const scroll = useScroll();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loadingArray, setLoadingArray] = useState([
    new THREE.TextureLoader().load(urlArray[0]),
  ]);
  const [currentTexture, setCurrentTexture] = useState(
    new THREE.TextureLoader().load(urlArray[0])
  );
  const size = useAspect(854, 480, 1);
  const handleClick = () => {
    window.open(urlArray[currentIdx]);
  };
  useEffect(() => {
    let tmpArray = [];
    for (let i = 0; i < urlArray?.length; i++) {
      let texture = new THREE.TextureLoader().load(urlArray[i]);
      tmpArray.push(texture);
    }
    setLoadingArray(tmpArray);
  }, [urlArray]);
  useEffect(() => {
    if (loadingArray[currentIdx].isTexture)
      setCurrentTexture(loadingArray[currentIdx]);
  }, [loadingArray, currentIdx]);
  useFrame(() => {
    if (!urlArray) return;
    const idx = Math.floor(scroll.offset * (urlArray?.length - 1));
    if (idx !== currentIdx) setCurrentIdx(idx);
  });
  return (
    <mesh scale={size} onClick={handleClick}>
      <planeGeometry />
      <meshBasicMaterial map={currentTexture} />
    </mesh>
  );
}

export default function Home() {
  const [sendVideo, setSendVideo] = useState(null);
  const [sendReady, setSendReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [urlArray, setUrlArray] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (file) => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append("video", sendVideo);
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/video`, {
        method: "POST",
        headers: {},
        body: formData,
      });
      const json = await data.json();
      if (!json) {
        setIsLoading(false);
        setSendReady(false);
        setTimeout(() => {
          setSendVideo(null);
        }, 600);
        throw new Error();
      }
      setUrlArray(json);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Something went wrong, please try again");
      setSendReady(false);
      setTimeout(() => {
        setSendVideo(null);
      }, 600);
    }
  };
  const onDrop = (data) => {
    const MAX_VIDEO_SIZE = 30 * 1024 * 1024;
    if (data[0].size > MAX_VIDEO_SIZE) {
      setErrorMessage("Please add file that is 30MB or less");
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
          {!sendVideo && !isLoading && !urlArray && (
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
                  transition: {
                    delay: 0.6,
                    duration: 0.7,
                    ease: "easeIn",
                  },
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
          {sendReady && !isLoading && !urlArray && (
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
                  transition: {
                    delay: 0.6,
                    duration: 0.7,
                    ease: "easeIn",
                  },
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
        {sendReady && !isLoading && !urlArray && (
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
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 1.5, ease: "backInOut" },
            }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className={styles.loadingWrapper}
          >
            <div className={styles.loading}></div>
          </motion.div>
        )}
      </AnimatePresence>
      {urlArray && (
        <motion.div
          initial={{ top: "-200%" }}
          animate={{
            top: "50%",
            transition: { duration: 1, ease: "easeOut" },
          }}
          className={styles.mainWrap}
        >
          <Canvas>
            <ScrollControls page={urlArray?.length || 0} damping={0}>
              <Scene urlArray={urlArray} />
              <OrthographicCamera />
            </ScrollControls>
          </Canvas>
        </motion.div>
      )}
    </div>
  );
}
