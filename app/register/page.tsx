"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Refs
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  // States
  const [activeField, setActiveField] = useState<"name" | "email" | "none">("none");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // --- ANIMATION INIT ---
  useEffect(() => {
    const armL = document.querySelector(".armL");
    const armR = document.querySelector(".armR");
    
    if (armL && armR) {
      gsap.set(armL, { x: -93, y: 220, rotation: 105, transformOrigin: "top left" });
      gsap.set(armR, { x: -93, y: 220, rotation: -105, transformOrigin: "top right" });
    }
  }, []);

  // --- HEAD & FACE MOVEMENT LOGIC ---
  useEffect(() => {
    if (isPasswordFocused) return;

    let currentLength = 0;
    if (activeField === "name") currentLength = name.length;
    else if (activeField === "email") currentLength = email.length;
    else {
      // Reset Face Center
      gsap.to([".eyeL", ".eyeR", ".nose", ".mouth", ".chin", ".face", ".eyebrow", ".outerEar", ".earHair", ".hair"], 
        { duration: 0.6, x: 0, y: 0, rotation: 0, skewX: 0, scale: 1 });
      return;
    }

    const limit = 30;
    const progress = Math.min(currentLength, limit) / limit; 
    const lookX = progress * 14; 
    const lookY = progress * 2;  

    // Apply Animations
    gsap.to([".eyeL", ".eyeR"], { duration: 0.4, x: lookX, y: lookY });
    gsap.to(".nose", { duration: 0.4, x: lookX * 0.8, y: lookY, rotation: progress * 5, transformOrigin: "center center" });
    gsap.to(".mouth", { duration: 0.4, x: lookX * 0.8, y: lookY, rotation: progress * 5, transformOrigin: "center center" });
    gsap.to(".chin", { duration: 0.4, x: lookX * 0.6, y: lookY });
    
    const faceSkew = progress * 5;
    gsap.to([".face", ".eyebrow"], { duration: 0.4, x: lookX * 0.3, skewX: -faceSkew, transformOrigin: "top center" });
    
    const earMove = lookX * 0.3;
    gsap.to([".earL .outerEar", ".earL .earHair"], { duration: 0.4, x: earMove, y: -earMove * 0.5 });
    gsap.to([".earR .outerEar", ".earR .earHair"], { duration: 0.4, x: earMove, y: earMove * 0.5 });
    gsap.to(".hair", { duration: 0.4, x: lookX * 0.4, rotation: progress * 2, transformOrigin: "bottom center" });

  }, [name, email, activeField, isPasswordFocused]);

  // --- PASSWORD HANDLERS ---
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
    setActiveField("none");
    
    // Reset Face
    gsap.to([".eyeL", ".eyeR", ".nose", ".mouth", ".chin", ".face", ".eyebrow", ".outerEar", ".earHair", ".hair"], 
      { duration: 0.3, x: 0, y: 0, rotation: 0, skewX: 0, scale: 1 });

    // Arms Up
    gsap.to(".armL", { duration: 0.45, x: -93, y: 2, rotation: 0, ease: "back.out(1.7)" });
    gsap.to(".armR", { duration: 0.45, x: -93, y: 2, rotation: 0, ease: "back.out(1.7)", delay: 0.05 });
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    // Arms Down
    gsap.to(".armL", { duration: 1.2, x: -93, y: 220, rotation: 105, ease: "power2.out" });
    gsap.to(".armR", { duration: 1.2, x: -93, y: 220, rotation: -105, ease: "power2.out", delay: 0.05 });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        alert("Account Created! Please Login.");
        router.push("/login");
      } else {
        const data = await res.json();
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative overflow-hidden py-10">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-900/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-900/30 rounded-full blur-[100px]" />
      </div>

      {/* Register Card */}
      <form onSubmit={handleSubmit} className="w-full max-w-[400px] bg-gray-900 p-8 rounded-2xl border border-gray-800 relative z-10 shadow-2xl mt-12">
        
        {/* YETI SVG */}
        <div className="w-[180px] h-[180px] mx-auto -mt-28 mb-4 relative rounded-full bg-black border-4 border-gray-800 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <div className="svgContainer" ref={svgRef} style={{ width: '100%', height: '100%' }}>
            <svg className="mySVG" viewBox="0 0 200 200">
              <defs>
                <circle id="armMaskPath" cx="100" cy="100" r="100" />
              </defs>
              <clipPath id="armMask">
                <use href="#armMaskPath" overflow="visible" />
              </clipPath>
              <circle cx="100" cy="100" r="100" fill="#000000" />
              
              <g className="body">
                <path fill="#FFFFFF" d="M193.3,135.9c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51,44.4,51,72v50H32.1 c-10.6,0-20,5.1-25.8,13l0,78h187L193.3,135.9z" />
                <path fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M193.3,135.9 c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51,44.4,51,72v50H32.1c-10.6,0-20,5.1-25.8,13" />
                <path fill="#DDF1FA" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z" />
              </g>
              <g className="earL">
                <g className="outerEar" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5">
                  <circle cx="47" cy="83" r="11.5" />
                  <path d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <g className="earHair">
                  <rect x="51" y="64" fill="#FFFFFF" width="15" height="35" />
                  <path d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9" fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
              <g className="earR">
                <g className="outerEar" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5">
                  <circle cx="155" cy="83" r="11.5" />
                  <path d="M155.7 78.9c2.3 0 4.1 1.9 4.1 4.1 0 2.3-1.9 4.1-4.1 4.1" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <g className="earHair">
                  <rect x="131" y="64" fill="#FFFFFF" width="20" height="35" />
                  <path d="M148.6 62.8c4.9 4.6 8.4 9.4 10.6 14.2-3.4-.1-6.8-.1-10.1.1 4 3.7 6.8 7.6 8.2 11.6-2.1 0-4.2 0-6.3.2 2.6 4.1 3.8 8.3 3.7 12.5-1.2-.7-3.4-1.4-5.2-1.9" fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
              <path className="chin" d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1" fill="none" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path className="face" fill="#DDF1FA" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46" />
              <path className="hair" fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474" />
              <g className="eyebrow">
                <path fill="#FFFFFF" d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z" />
                <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599" />
              </g>
              <g className="eyeL">
                <circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77" />
                <circle cx="84" cy="76" r="1" fill="#fff" />
              </g>
              <g className="eyeR">
                <circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77" />
                <circle cx="113" cy="76" r="1" fill="#fff" />
              </g>
              <g className="mouth">
                <path className="mouthBG" fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                <path className="mouthOutline" fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinejoin="round" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
              </g>
              <path className="nose" d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill="#3a5e77" />
              
              <g className="arms" clipPath="url(#armMask)">
                <g className="armL">
                  <path fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M121.3 97.4L111 58.7l38.8-10.4 20 36.1z" />
                  <path fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M134.4 52.5l19.3-5.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1L146 59.7M160.8 76.5l19.4-5.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-18.3 4.9M158.3 66.8l23.1-6.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-23.1 6.2M150.9 58.4l26-7c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-21.3 5.7" />
                  <path fill="#a9ddf3" d="M178.8 74.7l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8zM180.1 64l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8zM175.5 54.9l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8zM152.1 49.4l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8z" />
                  <path fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M123.5 96.8c-41.4 14.9-84.1 30.7-108.2 35.5L1.2 80c33.5-9.9 71.9-16.5 111.9-21.8" />
                  <path fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M108.5 59.4c7.7-5.3 14.3-8.4 22.8-13.2-2.4 5.3-4.7 10.3-6.7 15.1 4.3.3 8.4.7 12.3 1.3-4.2 5-8.1 9.6-11.5 13.9 3.1 1.1 6 2.4 8.7 3.8-1.4 2.9-2.7 5.8-3.9 8.5 2.5 3.5 4.6 7.2 6.3 11-4.9-.8-9-.7-16.2-2.7M94.5 102.8c-.6 4-3.8 8.9-9.4 14.7-2.6-1.8-5-3.7-7.2-5.7-2.5 4.1-6.6 8.8-12.2 14-1.9-2.2-3.4-4.5-4.5-6.9-4.4 3.3-9.5 6.9-15.4 10.8-.2-3.4.1-7.1 1.1-10.9M97.5 62.9c-1.7-2.4-5.9-4.1-12.4-5.2-.9 2.2-1.8 4.3-2.5 6.5-3.8-1.8-9.4-3.1-17-3.8.5 2.3 1.2 4.5 1.9 6.8-5-.6-11.2-.9-18.4-1 2 2.9.9 3.5 3.9 6.2" />
                </g>
                <g className="armR">
                  <path fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z" />
                  <path fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M252.4 52.4L233 47.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l10.3 2.8M226 76.4l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M228.4 66.7l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M235.8 58.3l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7" />
                  <path fill="#a9ddf3" d="M207.9 74.7l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM206.7 64l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM211.2 54.8l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM234.6 49.4l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8z" />
                  <path fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M263.3 96.7c41.4 14.9 84.1 30.7 108.2 35.5l14-52.3C352 70 313.6 63.5 273.6 58.1" />
                  <path fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M278.2 59.3l-18.6-10 2.5 11.9-10.7 6.5 9.9 8.7-13.9 6.4 9.1 5.9-13.2 9.2 23.1-.9M284.5 100.1c-.4 4 1.8 8.9 6.7 14.8 3.5-1.8 6.7-3.6 9.7-5.5 1.8 4.2 5.1 8.9 10.1 14.1 2.7-2.1 5.1-4.4 7.1-6.8 4.1 3.4 9 7 14.7 11 1.2-3.4 1.8-7 1.7-10.9M314 66.7s5.4-5.7 12.6-7.4c1.7 2.9 3.3 5.7 4.9 8.6 3.8-2.5 9.8-4.4 18.2-5.7.1 3.1.1 6.1 0 9.2 5.5-1 12.5-1.6 20.8-1.9-1.4 3.9-2.5 8.4-2.5 8.4" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
          Create Account
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1 ml-1">Full Name</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setActiveField("name")}
              onBlur={() => setActiveField("none")}
              className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-xl focus:border-purple-500 outline-none text-white font-medium transition-all"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1 ml-1">Email</label>
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setActiveField("email")}
              onBlur={() => setActiveField("none")}
              className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-xl focus:border-purple-500 outline-none text-white font-medium transition-all"
              placeholder="gymbro@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1 ml-1">Password</label>
            <input
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-xl focus:border-purple-500 outline-none text-white font-medium transition-all tracking-widest"
              placeholder="••••••••"
            />
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg transition-transform active:scale-95"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-purple-400 transition-colors">
            Already have an account? Login
          </Link>
        </div>

      </form>
    </div>
  );
}