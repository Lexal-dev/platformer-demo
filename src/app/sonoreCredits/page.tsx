"use client";
import React from "react";
import { FaBackward } from "react-icons/fa";

export default function SonoreCredits() {
    const handleBackClick = () => {
        window.history.back();
    };

    const credits = [
        ["COIN", "Coin", "Aeva", "https://opengameart.org/content/gold-coin-6"],
        ["CRACKWOOD", "35 wooden cracks/hits/destructions", "Independent.nu", "https://opengameart.org/content/35-wooden-crackshitsdestructions"],
        ["DASH", "Wind, hit, time morph", "qubodup", "https://opengameart.org/content/wind-hit-time-morph"],
        ["FIREBALL", "7 ghast sounds", "StarNinjas", "https://opengameart.org/content/7-ghast-sounds"],
        ["GHOSTBALL", "Ghost", "Ogrebane", "https://opengameart.org/content/ghost"],
        ["HEAL", "cure-magic", "Someoneman", "https://opengameart.org/content/cure-magic"],
        ["HITSLIME", "8 wet squish, slurp impacts", "Independent.nu", "https://opengameart.org/content/8-wet-squish-slurp-impacts"],
        ["JUMPER", "funny-comic-cartoon-bounce-sound", "Lamoot (submitted)", "https://opengameart.org/content/funny-comic-cartoon-bounce-sound"],
        ["MANA", "cure-magic", "Someoneman", "https://opengameart.org/content/cure-magic"],
        ["PLAYERHIT", "Hits", "pauliuw", "https://opengameart.org/content/hit-sounds"],
        ["SLASH", "Wind, hit, time morph", "qubodup", "https://opengameart.org/content/wind-hit-time-morph"],
        ["SPLASHWATER", "bubbles-single2", "BMacZero", "https://opengameart.org/content/bubble-sound-effects"],
        ["VICTORY", "brass-fanfare-with-timpani...", "u_ss015dykrt", "https://pixabay.com/sound-effects/brass-fanfare-with-timpani-and-winchimes-reverberated-146260"],
        ["WALK", "Fantozzi-footsteps", "Fantozzi (submitted by qubodup)", "https://opengameart.org/content/fantozzis-footsteps-grasssand-stone"],
        ["WAVE", "wave_04_cc0-11505", "transitking (submitted by qubodup)", "https://opengameart.org/content/water-waves"],
        ["CANON", "rumble.flac", "Michel Baradari", "https://opengameart.org/content/rumbleexplosion"],
        ["WOSH", "whoosh2.wav", "pyranostudios", "https://opengameart.org/content/air-whoosh"],
    ];

    return (
        <div className="w-full min-h-full text-white font-semibold pt-10 pb-10 overflow-auto">
            <button
                className="hover:text-green-300 cursor-pointer mb-6 ml-6"
                onClick={handleBackClick}
            >
                <FaBackward size={50} />
            </button>

            <div className="flex flex-col items-center">
                <p className="text-center text-3xl font-bold my-6">Effets Sonores</p>
                <div className="flex md:justify-center overflow-x-auto w-full max-w-full px-4">
                    <table className="table-auto border border-white text-left cursor-pointer min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-900">
                                <th className="border border-white p-2">IN-GAME NAME</th>
                                <th className="border border-white p-2">ORIGINAL NAME</th>
                                <th className="border border-white p-2">AUTHOR</th>
                                <th className="border border-white p-2">LINK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {credits.map(([inGame, original, author, link]) => (
                                <tr key={inGame} className="hover:bg-slate-900 bg-white/20">
                                    <td className="border border-white p-2">{inGame}</td>
                                    <td className="border border-white p-2">{original}</td>
                                    <td className="border border-white p-2">{author}</td>
                                    <td className="border border-white p-2">
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-green-300"
                                        >
                                            Source
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col items-center mt-10">
                <p className="text-center text-3xl font-bold my-6">Musiques</p>
                <div className="flex md:justify-center overflow-x-auto w-full max-w-full px-4">
                    <table className="table-auto border border-white text-left cursor-pointer min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-800">
                                <th className="border border-white p-2">IN-GAME NAME</th>
                                <th className="border border-white p-2">ORIGINAL NAME</th>
                                <th className="border border-white p-2">AUTHOR</th>
                                <th className="border border-white p-2">LINK</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-slate-900 bg-white/20">
                                <td className="border border-white p-2">bossFight</td>
                                <td className="border border-white p-2">bossFight</td>
                                <td className="border border-white p-2">Sergei Chetvertnykh (Pixabay)</td>
                                <td className="border border-white p-2">
                                    <a
                                        href="https://pixabay.com/users/sergequadrado-24990007/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=275533"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-green-300"
                                    >
                                        Source
                                    </a>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-900 bg-white/20">
                                <td className="border border-white p-2">principal theme</td>
                                <td className="border border-white p-2">Principal Theme / Spooky Island</td>
                                <td className="border border-white p-2">Eric Matyas</td>
                                <td className="border border-white p-2">
                                    <a
                                        href="https://soundimage.org/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-green-300"
                                    >
                                        Source
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
