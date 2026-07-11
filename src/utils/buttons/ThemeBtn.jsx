

const ThemeBtn = ({
  btnType,
  handleBtnClick,
  btnText,
  iconsLogo,
  isDisable,
}) => {
  return (
    <button
      disabled={isDisable}
      type={btnType}
      onClick={handleBtnClick}
      className={`
        relative overflow-hidden group font-medium
        w-full py-2 px-4 rounded-xl text-base
        transition-all duration-300 ease-out
        inline-flex items-center justify-center gap-2
        
    
        bg-indigo-600 text-white
        shadow-[0_4px_14px_0_rgb(79,70,229,0.39)]
        
       
        hover:bg-indigo-700 
        hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)]
        hover:-translate-y-0.5
        active:translate-y-0 active:scale-[0.98]

       
        disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none
        
        ${isDisable ? "bg-slate-400" : "cursor-pointer"}
      `}
    >
      {/* Shine Effect Overlay */}
      <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />

      <span className="relative z-10 tracking-widest text-[14px]">
        {btnText}
      </span>

      {iconsLogo && (
        <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
          {iconsLogo}
        </span>
      )}

      {/* Tailwind Custom Keyframe needed in global CSS or via arbitrary values */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </button>
  );
};

export default ThemeBtn;