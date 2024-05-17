import './FixedDropout';
import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import './App.css';
import video from "./assets/background.mp4";
import loadingGif from "./assets/Loading.gif";
import loadingSVG from "./assets/LoadingIndicator.svg";

function App() {

  const [predictions, setPredictions] = useState([]);
  const [averagePrediction, setAveragePrediction] = useState(null);
  const fileInputRef = useRef(null);

  async function predictVideoAuthenticity(videoFile, model, inputSize = 128) {
    document.getElementById("LoadingContainer").classList.remove("hidden");
    document.getElementById("LoadingContainer").classList.add("flex");

    const videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(videoFile);
    await videoElement.play();

    const frames = [];
    while (!videoElement.paused) {
      const prediction = await predictFrameAuthenticity(videoElement, model, inputSize);
      frames.push(prediction);
    }

    document.getElementById("StartContainer").classList.add("translate-x-[25vw]");
    document.getElementById("LoadingContainer").classList.remove("flex");
    document.getElementById("LoadingContainer").classList.add("hidden");

    const avgPrediction = frames.reduce((acc, curr) => acc + curr, 0) / frames.length;
    setPredictions(frames);
    setAveragePrediction(avgPrediction);

    document.getElementById("TableContainer").classList.add("translate-x-[50vw]");
  }

  async function predictFrameAuthenticity(videoElement, model, inputSize) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = inputSize;
    canvas.height = inputSize;
    ctx.drawImage(videoElement, 0, 0, inputSize, inputSize);

    const imageData = ctx.getImageData(0, 0, inputSize, inputSize);
    const tensor = tf.browser.fromPixels(imageData).toFloat().div(tf.scalar(255)).expandDims();
    const prediction = await model.predict(tensor).data();

    return prediction[0];
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      tf.loadLayersModel('../../model/model.json').then(model => {
        predictVideoAuthenticity(file, model);
      });
    }
  }

  const handleTextClick = () => {
    fileInputRef.current.click();
  };


  return (
    <div>
      <div className='fixed top-0 left-0 w-full h-full object-cover z-[-1] bg-black bg-opacity-80'></div>
      <video autoPlay muted loop className='fixed top-0 left-0 w-full h-full object-cover z-[-2]' > <source src={video} type='video/mp4' /> </video>
      <div id='StartContainer' className='duration-500 ease-in-out '>
        <h1 className='p-2 text-5xl text-white font-bold'> Deepfake Detection <span className='font-extrabold text-gray-200'> ? </span> </h1>
        <h2 className='text-xl font-medium pb-5 text-white'> A website that detects Deepfake videos using <span className='text-red-500 font-extrabold text-2xl'> Machine Learning </span> model </h2>
        <p className='font-medium text-lg text-white'> Try <span onClick={handleTextClick} className='hover:cursor-pointer text-sky-500 hover:text-blue-300'> Upload Video </span> to start your journey </p>
        <input className='hidden' ref={fileInputRef} type="file" accept="video/mp4" onChange={handleFileUpload} />
        <div id='LoadingContainer' className='hidden flex-col items-center pt-10 '>
          <img src={loadingSVG} className='h-14'/>
          <p className='text-white mt-[-7px]'> Analyzing the video </p>
        </div>
      </div>
      <div id='TableContainer' className='flex flex-col absolute top-0 left-[-50vw] duration-500 ease-in-out '>
      {averagePrediction !== null && (
          <>
            <div className='p-10 bg-black bg-opacity-55 m-10 rounded-xl shadow-2xl shadow-black'>
              <h2 className='text-white text-4xl font-bold pb-5'>Predictions</h2>
              <table className='text-white w-[40vw] mb-7'>
                <thead>
                  <tr>
                    <th>Frame Number</th>
                    <th>Prediction Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{pred.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className='text-white'>Average Prediction Probability: {averagePrediction.toFixed(4)}</p>
            </div>
            <div className='h-20'></div>
          </>
      )}
      </div>
    </div>
  );
}

export default App
