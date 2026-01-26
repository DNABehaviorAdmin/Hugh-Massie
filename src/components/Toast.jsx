import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const icons = {
    download: (
        <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
    ),
    mail: (
        <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
    )
};

const Toast = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState({ title: '', message: '', icon: 'download' });

    useImperativeHandle(ref, () => ({
        show: (title, message, iconType = 'download') => {
            setContent({ title, message, icon: iconType });
            setVisible(true);
            setTimeout(() => setVisible(false), 4000);
        }
    }));

    return (
        <div id="toast-notification" className={`fixed bottom-4 left-4 right-4 md:left-auto md:bottom-6 md:right-6 z-60 transition-all duration-500 flex justify-center md:block ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32 pointer-events-none'}`}>
            <div className="bg-slate-900/90 backdrop-blur-md border border-accent/20 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[300px]">
                <div className="text-accent">
                    {icons[content.icon]}
                </div>
                <div>
                    <h4 className="font-bold text-sm text-accent">{content.title}</h4>
                    <p className="text-xs text-slate-400">{content.message}</p>
                </div>
                <button onClick={() => setVisible(false)} className="ml-auto text-slate-500 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
});

export default Toast;
