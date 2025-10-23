import React, { useContext } from 'react';
import TextGenerateEffect from './ui/TextGenerate';
import Header from './ui/Header';
import { useGetChallengesQuery } from '../redux/api/challengeSlice';
import PlaygroundCodeEditor from './PlaygroundCodeEditor';
import { ThemeContext } from '../Contexts/ThemeContext';

const PlayGround = () => {
  const { theme } = useContext(ThemeContext);
  const { data: challenges } = useGetChallengesQuery();

  return (
    <div
      className={`${
        theme === "light"
          ? "bg-gray-100"
          : "bg-gradient-to-r from-[#070045] via-[#0d0066] to-[#070045]"
      } m-0 flex flex-col min-h-screen`}
    >
      <Header />
      <section>
        <div className="w-full max-w-xl mt-8 text-center mx-auto px-4">
          <h1
            className={`text-3xl md:text-4xl font-bold flex justify-center ${
              theme === "light" ? "text-gray-800" : "text-gray-300"
            }`}
          >
            <span
              className={`mr-3 ${
                theme === "light" ? "text-blue-600" : "text-[#8F57EF]"
              }`}
            >
              Code
            </span>
            <TextGenerateEffect
              className={`font-bold ${
                theme === "light" ? "text-green-600" : "text-[#00DEDE]"
              }`}
              words={"Playground"}
            />
          </h1>
          <p
            className={`mt-4 ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Experiment with code, test your ideas and learn by doing in our interactive playground.
          </p>
        </div>
      </section>

      <section className="editor my-8 px-4 md:px-10">
        <PlaygroundCodeEditor />
      </section>

      <section
        className={`mt-16 mx-4 md:mx-10 lg:mx-32 ${
          theme === "light" ? "text-gray-800" : "text-gray-100"
        }`}
      >
        <h1 className="text-center text-xl md:text-2xl font-bold">
          Here are some projects you might want to try out in the playground
        </h1>

        {challenges?.map((project, index) => (
          <div
            key={index}
            className={`mx-auto w-[70%] py-8 rounded-xl mt-8 ${
              theme === "light" ? "bg-white shadow-md" : "bg-[#161077]"
            }`}
          >
            <div className="text-center py-2">
              <h2 className="text-lg md:text-xl font-semibold">
                {project.title}
              </h2>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PlayGround;