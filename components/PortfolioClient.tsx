"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import {
    Menu,
    X,
    Moon,
    Sun,
    ChevronRight,
    ChevronDown,
    Home,
    Terminal,
    Cpu,
    Search,
    Command,
    Rabbit,
    ArrowUp,
    ArrowLeft,
    ArrowRight,
    List,
    FileText,
    Download,
    ExternalLink
} from 'lucide-react';
import { MDXFile } from '@/lib/types';

import { useRouter } from 'next/navigation';

// --- Types ---
type ViewState =
    | { type: 'file', id: string }
    | { type: 'folder', name: string }
    | { type: 'root' };

interface PortfolioClientProps {
    initialContent: MDXFile[];
    initialActiveFileId?: string;
}

interface TocItem {
    id: string;
    text: string;
    level: number;
}

// --- Bunny Animation Component ---
const BunnyAnimation = () => {
    const text = "tarunika";

    return (
        <div className="flex flex-col items-start gap-0.5">
            <div className="bunny-slide-container overflow-hidden">
                <a tabIndex={-1} href="/" style={{ display: 'flex', cursor: 'default', pointerEvents: 'none' }}>
                    <svg width="36" height="36" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scale(1)', transformOrigin: 'center center', transition: 'transform 0.3s ease-out' }}>
                        <path className="nav-ear-left-idle dark:fill-zinc-50 fill-zinc-900" d="M3.738 10.2164L7.224 2.007H9.167L5.676 10.2164H3.738ZM10.791 6.42705C10.791 5.90346 10.726 5.42764 10.596 4.99959C10.47 4.57155 10.292 4.16643 10.063 3.78425C9.833 3.39825 9.56 3.01797 9.243 2.64343C8.926 2.26507 8.767 2.07589 8.767 2.07589L10.24 0.957996C10.24 0.957996 10.433 1.17203 10.819 1.60007C11.209 2.0243 11.559 2.49056 11.869 2.99886C12.178 3.50717 12.413 4.04222 12.574 4.60403C12.734 5.16584 12.814 5.77352 12.814 6.42705C12.814 7.10734 12.73 7.7303 12.562 8.29593C12.394 8.85774 12.153 9.3966 11.84 9.9126C11.526 10.4247 11.181 10.8833 10.802 11.2884C10.428 11.6974 10.24 11.9018 10.24 11.9018L8.767 10.7839C8.767 10.7839 8.924 10.5948 9.237 10.2164C9.554 9.8419 9.83 9.4597 10.063 9.06985C10.3 8.6762 10.479 8.26726 10.602 7.84304C10.728 7.41499 10.791 6.943 10.791 6.42705Z" style={{ transition: 'fill 0.2s ease-out' }}></path>
                        <path className="nav-ear-right-idle dark:fill-zinc-50 fill-zinc-900" d="M15.003 10.2164L18.489 2.007H20.432L16.941 10.2164H15.003ZM22.056 6.42705C22.056 5.90346 21.991 5.42764 21.861 4.99959C21.735 4.57155 21.557 4.16643 21.328 3.78425C21.098 3.39825 20.825 3.01797 20.508 2.64343C20.191 2.26507 20.032 2.07589 20.032 2.07589L21.505 0.957996C21.505 0.957996 21.698 1.17203 22.084 1.60007C22.474 2.0243 22.824 2.49056 23.133 2.99886C23.443 3.50717 23.678 4.04222 23.839 4.60403C23.999 5.16584 24.079 5.77352 24.079 6.42705C24.079 7.10734 23.995 7.7303 23.827 8.29593C23.659 8.85774 23.418 9.3966 23.105 9.9126C22.791 10.4247 22.445 10.8833 22.067 11.2884C21.693 11.6974 21.505 11.9018 21.505 11.9018L20.032 10.7839C20.032 10.7839 20.189 10.5948 20.502 10.2164C20.819 9.8419 21.094 9.4597 21.328 9.06985C21.565 8.6762 21.744 8.26726 21.866 7.84304C21.993 7.41499 22.056 6.943 22.056 6.42705Z" style={{ transition: 'fill 0.2s ease-out' }}></path>
                        <path className="dark:fill-zinc-50 fill-zinc-900" d="M2.03 20.4328C2.03 20.9564 2.093 21.4322 2.219 21.8602C2.345 22.2883 2.523 22.6953 2.752 23.0813C2.981 23.4635 3.254 23.8419 3.572 24.2164C3.889 24.5948 4.047 24.7839 4.047 24.7839L2.574 25.9018C2.574 25.9018 2.379 25.6878 1.989 25.2598C1.603 24.8355 1.256 24.3693 0.946 23.861C0.636 23.3527 0.401 22.8176 0.241 22.2558C0.08 21.694 0 21.0863 0 20.4328C0 19.7525 0.084 19.1314 0.252 18.5696C0.421 18.004 0.661 17.4651 0.975 16.953C1.288 16.4371 1.632 15.9765 2.007 15.5714C2.385 15.1625 2.574 14.958 2.574 14.958L4.047 16.0759C4.047 16.0759 3.889 16.2651 3.572 16.6434C3.258 17.018 2.983 17.4021 2.746 17.7957C2.513 18.1855 2.335 18.5945 2.213 19.0225C2.091 19.4467 2.03 19.9168 2.03 20.4328ZM23.687 20.4271C23.687 19.9035 23.622 19.4276 23.492 18.9996C23.366 18.5715 23.188 18.1664 22.959 17.7843C22.729 17.3982 22.456 17.018 22.139 16.6434C21.822 16.2651 21.663 16.0759 21.663 16.0759L23.136 14.958C23.136 14.958 23.329 15.172 23.715 15.6001C24.105 16.0243 24.455 16.4906 24.765 16.9989C25.074 17.5072 25.309 18.0422 25.47 18.604C25.63 19.1658 25.71 19.7735 25.71 20.4271C25.71 21.1073 25.626 21.7303 25.458 22.2959C25.29 22.8577 25.049 23.3966 24.736 23.9126C24.422 24.4247 24.077 24.8833 23.698 25.2884C23.324 25.6974 23.136 25.9018 23.136 25.9018L21.663 24.7839C21.663 24.7839 21.82 24.5948 22.133 24.2164C22.45 23.8419 22.726 23.4597 22.959 23.0698C23.196 22.6762 23.375 22.2673 23.498 21.843C23.624 21.415 23.687 20.943 23.687 20.4271Z" style={{ transition: 'fill 0.2s ease-out' }}></path>
                        <circle className="nav-eye-left-idle dark:fill-zinc-50 fill-zinc-900" cx="8.277" cy="20.466" r="1.8" style={{ transition: 'fill 0.2s ease-out, opacity 0.2s ease-out' }}></circle>
                        <circle className="nav-eye-right-idle dark:fill-zinc-50 fill-zinc-900" cx="19.878" cy="20.466" r="1.8" style={{ transition: 'fill 0.2s ease-out, opacity 0.2s ease-out' }}></circle>
                        <g className="nav-x-eye dark:stroke-zinc-50 stroke-zinc-900" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0, transition: 'opacity 0.2s ease-out, stroke 0.2s ease-out' }}>
                            <line x1="6.5" y1="18.7" x2="10" y2="22.2"></line>
                            <line x1="10" y1="18.7" x2="6.5" y2="22.2"></line>
                        </g>
                        <g className="nav-x-eye dark:stroke-zinc-50 stroke-zinc-900" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0, transition: 'opacity 0.2s ease-out, stroke 0.2s ease-out' }}>
                            <line x1="18.1" y1="18.7" x2="21.6" y2="22.2"></line>
                            <line x1="21.6" y1="18.7" x2="18.1" y2="22.2"></line>
                        </g>
                    </svg>
                </a>
            </div>

            <div className="text-xl font-bold tracking-tight flex items-center">
                <span
                    className="typed-slash text-blue-500 dark:text-blue-400"
                    style={{ animationDelay: '0s' }}
                >
                    /
                </span>
                {text.split('').map((char, index) => (
                    <span
                        key={index}
                        className="typed-char text-foreground"
                        style={{ animationDelay: `${0.4 + (index * 0.08)}s` }}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
};

// --- Extract headings from markdown content ---
function extractHeadings(content: string): TocItem[] {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
        const text = match[2].replace(/[*_`~]/g, '').trim();
        const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
        headings.push({ id, text, level: match[1].length });
    }
    return headings;
}

// --- Content preview ---
function getContentPreview(content: string): string {
    const stripped = content
        .replace(/^---[\s\S]*?---/, '')
        .replace(/^#+\s+.+$/gm, '')
        .replace(/[*_`~\[\]()#>!|]/g, '')
        .replace(/\n+/g, ' ')
        .trim();
    return stripped.length > 100 ? stripped.slice(0, 100) + '…' : stripped;
}

// --- Mermaid Component ---
const Mermaid = ({ chart }: { chart: string }) => {
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'neutral',
            securityLevel: 'loose',
        });
        
        if (mermaidRef.current) {
            mermaidRef.current.innerHTML = ''; // Clear previous render
            mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart).then(({ svg }) => {
                if (mermaidRef.current) {
                    mermaidRef.current.innerHTML = svg;
                }
            }).catch(e => {
                console.error("Mermaid parsing error", e);
            });
        }
    }, [chart]);

    return (
        <div 
            ref={mermaidRef} 
            className="mermaid overflow-x-auto flex justify-center py-6 my-8 border border-border-subtle rounded-xl bg-zinc-50 dark:bg-zinc-900/50"
        />
    );
};


// --- ProgressBar Component (Isolated render) ---
const ProgressBar = React.memo(({ scrollContainerRef, active }: { 
    scrollContainerRef: React.RefObject<HTMLDivElement | null>,
    active: boolean 
}) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!active) return;
        
        let frameId: number;
        const handleScroll = () => {
            if (frameId) cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                const container = scrollContainerRef.current;
                if (container) {
                    const { scrollTop, scrollHeight, clientHeight } = container;
                    const totalScroll = scrollHeight - clientHeight;
                    const currentProgress = totalScroll <= 0 ? 100 : (scrollTop / totalScroll) * 100;
                    setProgress(currentProgress);
                }
            });
        };

        const container = scrollContainerRef.current;
        if (container) {
            setProgress(0);
            container.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        }
        return () => {
            if (container) container.removeEventListener('scroll', handleScroll);
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [active, scrollContainerRef]);

    if (!active || progress <= 0) return null;

    return (
        <div className="h-[2px] w-full bg-border-subtle absolute top-16 z-30 pointer-events-none">
            <div
                className="h-full bg-zinc-800 dark:bg-zinc-100 origin-left"
                style={{ 
                    transform: `scaleX(${progress / 100})`,
                    willChange: 'transform',
                    WebkitBackfaceVisibility: 'hidden'
                }}
            />
        </div>
    );
});
ProgressBar.displayName = 'ProgressBar';

// --- ScrollToTop Button (Isolated render) ---
const ScrollToTopButton = React.memo(({ scrollContainerRef }: { 
    scrollContainerRef: React.RefObject<HTMLDivElement | null> 
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let frameId: number;
        const handleScroll = () => {
            if (frameId) cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                const container = scrollContainerRef.current;
                if (container) {
                    setVisible(container.scrollTop > 400);
                }
            });
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
        }
        return () => {
            if (container) container.removeEventListener('scroll', handleScroll);
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [scrollContainerRef]);

    const scrollToTop = () => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`absolute bottom-6 right-6 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg transition-all duration-300 z-40 hover:scale-110 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
            aria-label="Scroll to top"
        >
            <ArrowUp size={16} />
        </button>
    );
});
ScrollToTopButton.displayName = 'ScrollToTopButton';

export default function PortfolioClient({ initialContent, initialActiveFileId }: PortfolioClientProps) {
    const router = useRouter();
    const SITE_CONTENT = initialContent;

    const [viewState, setViewState] = useState<ViewState>(
        initialActiveFileId ? { type: 'file', id: initialActiveFileId } : { type: 'root' }
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeHeadingId, setActiveHeadingId] = useState<string>('');
    const [mobileTocOpen, setMobileTocOpen] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Initialize Theme
    useEffect(() => {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(systemPrefersDark);
    }, []);

    // Folder Expand/Collapse State
    const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
        'about': true,
        'writing': true,
        'sop': true,
        'papers': true
    });

    const toggleFolder = (folder: string) => {
        setOpenFolders(prev => ({
            ...prev,
            [folder]: !prev[folder]
        }));
    };

    // Reading Time Calculation
    const calculateReadingTime = (text: string) => {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min`;
    };

    // Dark Mode Toggle Logic
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Derived state for the sidebar
    const filteredFiles = useMemo(() => {
        if (!searchQuery) return SITE_CONTENT;
        const lowerQuery = searchQuery.toLowerCase();
        return SITE_CONTENT.filter(file =>
            file.title.toLowerCase().includes(lowerQuery) ||
            file.fileName.toLowerCase().includes(lowerQuery) ||
            file.content.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery, SITE_CONTENT]);

    const filesByFolder = useMemo(() => {
        const groups: Record<string, MDXFile[]> = {};
        filteredFiles.forEach(file => {
            if (!groups[file.folder]) groups[file.folder] = [];
            groups[file.folder].push(file);
        });
        return groups;
    }, [filteredFiles]);

    const activeFile = viewState.type === 'file'
        ? SITE_CONTENT.find(n => n.id === viewState.id)
        : null;

    // Extract TOC from active file
    const tocItems = useMemo(() => {
        if (!activeFile) return [];
        return extractHeadings(activeFile.content as string);
    }, [activeFile]);

    // Previous/Next navigation within same folder
    const prevNextFiles = useMemo(() => {
        if (!activeFile) return { prev: null, next: null };
        const folderFiles = (filesByFolder[activeFile.folder] || []);
        const idx = folderFiles.findIndex(f => f.id === activeFile.id);
        return {
            prev: idx > 0 ? folderFiles[idx - 1] : null,
            next: idx < folderFiles.length - 1 ? folderFiles[idx + 1] : null,
        };
    }, [activeFile, filesByFolder]);

    // Auto-expand folder when opening a file
    useEffect(() => {
        if (activeFile) {
            setOpenFolders(prev => ({
                ...prev,
                [activeFile.folder]: true
            }));
        }
    }, [activeFile]);

    // Reset scroll position on view change
    useEffect(() => {
        scrollContainerRef.current?.scrollTo(0, 0);
    }, [viewState]);

    // Active heading tracking via IntersectionObserver
    useEffect(() => {
        if (viewState.type !== 'file' || tocItems.length === 0) return;

        const timer = setTimeout(() => {
            const container = scrollContainerRef.current;
            if (!container) return;

            const headingElements = tocItems
                .map(item => container.querySelector(`#${CSS.escape(item.id)}`))
                .filter(Boolean) as HTMLElement[];

            if (headingElements.length === 0) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    const visibleEntries = entries.filter(e => e.isIntersecting);
                    if (visibleEntries.length > 0) {
                        setActiveHeadingId(visibleEntries[0].target.id);
                    }
                },
                {
                    root: container,
                    rootMargin: '-80px 0px -70% 0px',
                    threshold: 0,
                }
            );

            headingElements.forEach(el => observer.observe(el));
            return () => observer.disconnect();
        }, 300);

        return () => clearTimeout(timer);
    }, [viewState, tocItems]);

    // Reset mobile TOC on view change
    useEffect(() => {
        setMobileTocOpen(false);
    }, [viewState]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            if (e.key.toLowerCase() === 'w' && !isTyping && !e.metaKey && !e.ctrlKey && !e.altKey) {
                setIsDarkMode(prev => !prev);
            }

            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // --- Handlers for Navigation ---
    const handleFileClick = (fileId: string) => {
        setViewState({ type: 'file', id: fileId });
        setMobileMenuOpen(false);
        // Find the file to determine folder and slug
        const file = SITE_CONTENT.find(f => f.id === fileId);
        if (file) {
            router.push(`/${file.folder}/${file.id}`);
        }
    };
    const handleFolderClick = (folderName: string) => {
        setViewState({ type: 'folder', name: folderName });
        setMobileMenuOpen(false);
        router.push('/', { scroll: false }); 
    };

    const handleRootClick = () => {
        setViewState({ type: 'root' });
        setMobileMenuOpen(false);
        router.push('/', { scroll: false });
    };


    const scrollToHeading = (id: string) => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const el = container.querySelector(`#${CSS.escape(id)}`);
        if (el) {
            const containerRect = container.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const offset = elRect.top - containerRect.top + container.scrollTop - 100;
            container.scrollTo({ top: offset, behavior: 'smooth' });
            setActiveHeadingId(id);
            setMobileTocOpen(false);
        }
    };

    return (
        <div className="h-screen w-full bg-background text-foreground font-sans transition-colors duration-200">
            <div className="flex h-screen w-full overflow-hidden">

                {/* ─── Sidebar ─── */}
                <aside className={`
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:translate-x-0 
                    transition-transform duration-300 ease-in-out
                    fixed md:relative z-30 w-80 h-full 
                    bg-sidebar border-r border-border-subtle 
                    flex flex-col
                `}>
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-border-subtle/40">
                        <div className="mb-6">
                            <BunnyAnimation />
                        </div>

                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-2.5 text-muted-text w-4 h-4 group-hover:text-foreground transition-colors" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                name="search"
                                autoComplete="off"
                                aria-label="Search content"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-background border border-border-subtle rounded-lg pl-10 pr-8 py-2 text-sm focus:outline-none focus:border-zinc-400 focus:ring-0 transition-all placeholder:text-zinc-400"
                            />
                            <div className="absolute right-3 top-2.5 flex items-center gap-1 pointer-events-none">
                                <Command className="w-3 h-3 text-zinc-400" />
                                <span className="text-[10px] text-zinc-400 font-medium">K</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                        <button
                            onClick={handleRootClick}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${viewState.type === 'root' ? 'bg-zinc-200/50 dark:bg-zinc-800/50 text-foreground font-medium' : 'text-muted-text hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-foreground'}`}
                        >
                            <Home size={16} />
                            <span>Overview</span>
                        </button>

                        <div className="pt-6 pb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-text/80">
                            Explorer
                        </div>

                        {Object.keys(filesByFolder).sort().map(folderName => (
                            <div key={folderName} className="mb-2">
                                <button
                                    onClick={() => toggleFolder(folderName)}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-foreground/80 hover:text-foreground select-none transition-colors group"
                                >
                                    <span className="text-muted-text group-hover:text-foreground transition-colors">
                                        {openFolders[folderName] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </span>
                                    <span className="font-medium">{folderName}</span>
                                </button>

                                {openFolders[folderName] && (
                                    <div className="ml-3.5 pl-3 border-l-[1.5px] border-border-subtle mt-1 space-y-1">
                                        {filesByFolder[folderName].map(file => {
                                            const isActive = viewState.type === 'file' && viewState.id === file.id;
                                            return (
                                                <button
                                                    key={file.id}
                                                    onClick={() => handleFileClick(file.id)}
                                                    className={`
                                                        w-full text-left px-3 py-1.5 rounded-md text-sm truncate transition-colors flex items-center justify-between group/file
                                                        ${isActive
                                                            ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground font-medium'
                                                            : 'text-muted-text hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}
                                                    `}
                                                >
                                                    <span>{file.fileName.replace(/\.mdx$/, '')}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* ─── Main Content ─── */}
                <main className="flex-1 flex flex-col h-full relative bg-background overflow-hidden min-w-0">

                    {/* Header / Breadcrumbs */}
                    <header className="h-16 border-b border-border-subtle flex items-center justify-between px-8 bg-background/80 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex items-center gap-3 text-sm text-muted-text overflow-hidden whitespace-nowrap font-medium">
                            <button className="md:hidden text-foreground mr-2" onClick={() => setMobileMenuOpen(true)}>
                                <Menu size={20} />
                            </button>

                            <button onClick={handleRootClick} className="hover:text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 px-1.5 py-0.5 rounded">
                                ~
                            </button>
                            <span className="text-zinc-300 dark:text-zinc-600">/</span>
                            {viewState.type !== 'root' && (
                                <>
                                    <button
                                        onClick={() => handleFolderClick(viewState.type === 'file' ? (activeFile?.folder || '') : viewState.name)}
                                        className="hover:text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 px-1.5 py-0.5 rounded"
                                    >
                                        {viewState.type === 'file' ? activeFile?.folder : viewState.name}
                                    </button>

                                    {viewState.type === 'file' && (
                                        <>
                                            <span className="text-zinc-300 dark:text-zinc-600">/</span>
                                            <span className="text-foreground font-semibold px-1.5">{activeFile?.fileName}</span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-text hover:text-foreground transition-colors"
                            >
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        </div>
                    </header>

                    {/* Reading Progress */}
                    <ProgressBar 
                        scrollContainerRef={scrollContainerRef} 
                        active={viewState.type === 'file'} 
                    />

                    {/* Content Scroll Area */}
                    <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto scroll-smooth"
                    >
                        {viewState.type === 'root' ? (
                            <div className="flex flex-col justify-between min-h-[calc(100vh-4rem)] select-none">
                                {/* Hero: bunny + greeting */}
                                <div className="flex flex-col items-center text-center px-10 md:px-16 pt-20 md:pt-28 mx-auto max-w-2xl">
                                    <svg width="64" height="64" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-10">
                                        <path className="dark:fill-zinc-50 fill-zinc-900" d="M3.738 10.2164L7.224 2.007H9.167L5.676 10.2164H3.738ZM10.791 6.42705C10.791 5.90346 10.726 5.42764 10.596 4.99959C10.47 4.57155 10.292 4.16643 10.063 3.78425C9.833 3.39825 9.56 3.01797 9.243 2.64343C8.926 2.26507 8.767 2.07589 8.767 2.07589L10.24 0.957996C10.24 0.957996 10.433 1.17203 10.819 1.60007C11.209 2.0243 11.559 2.49056 11.869 2.99886C12.178 3.50717 12.413 4.04222 12.574 4.60403C12.734 5.16584 12.814 5.77352 12.814 6.42705C12.814 7.10734 12.73 7.7303 12.562 8.29593C12.394 8.85774 12.153 9.3966 11.84 9.9126C11.526 10.4247 11.181 10.8833 10.802 11.2884C10.428 11.6974 10.24 11.9018 10.24 11.9018L8.767 10.7839C8.767 10.7839 8.924 10.5948 9.237 10.2164C9.554 9.8419 9.83 9.4597 10.063 9.06985C10.3 8.6762 10.479 8.26726 10.602 7.84304C10.728 7.41499 10.791 6.943 10.791 6.42705Z"></path>
                                        <path className="dark:fill-zinc-50 fill-zinc-900" d="M15.003 10.2164L18.489 2.007H20.432L16.941 10.2164H15.003ZM22.056 6.42705C22.056 5.90346 21.991 5.42764 21.861 4.99959C21.735 4.57155 21.557 4.16643 21.328 3.78425C21.098 3.39825 20.825 3.01797 20.508 2.64343C20.191 2.26507 20.032 2.07589 20.032 2.07589L21.505 0.957996C21.505 0.957996 21.698 1.17203 22.084 1.60007C22.474 2.0243 22.824 2.49056 23.133 2.99886C23.443 3.50717 23.678 4.04222 23.839 4.60403C23.999 5.16584 24.079 5.77352 24.079 6.42705C24.079 7.10734 23.995 7.7303 23.827 8.29593C23.659 8.85774 23.418 9.3966 23.105 9.9126C22.791 10.4247 22.445 10.8833 22.067 11.2884C21.693 11.6974 21.505 11.9018 21.505 11.9018L20.032 10.7839C20.032 10.7839 20.189 10.5948 20.502 10.2164C20.819 9.8419 21.094 9.4597 21.328 9.06985C21.565 8.6762 21.744 8.26726 21.866 7.84304C21.993 7.41499 22.056 6.943 22.056 6.42705Z"></path>
                                        <path className="dark:fill-zinc-50 fill-zinc-900" d="M2.03 20.4328C2.03 20.9564 2.093 21.4322 2.219 21.8602C2.345 22.2883 2.523 22.6953 2.752 23.0813C2.981 23.4635 3.254 23.8419 3.572 24.2164C3.889 24.5948 4.047 24.7839 4.047 24.7839L2.574 25.9018C2.574 25.9018 2.379 25.6878 1.989 25.2598C1.603 24.8355 1.256 24.3693 0.946 23.861C0.636 23.3527 0.401 22.8176 0.241 22.2558C0.08 21.694 0 21.0863 0 20.4328C0 19.7525 0.084 19.1314 0.252 18.5696C0.421 18.004 0.661 17.4651 0.975 16.953C1.288 16.4371 1.632 15.9765 2.007 15.5714C2.385 15.1625 2.574 14.958 2.574 14.958L4.047 16.0759C4.047 16.0759 3.889 16.2651 3.572 16.6434C3.258 17.018 2.983 17.4021 2.746 17.7957C2.513 18.1855 2.335 18.5945 2.213 19.0225C2.091 19.4467 2.03 19.9168 2.03 20.4328ZM23.687 20.4271C23.687 19.9035 23.622 19.4276 23.492 18.9996C23.366 18.5715 23.188 18.1664 22.959 17.7843C22.729 17.3982 22.456 17.018 22.139 16.6434C21.822 16.2651 21.663 16.0759 21.663 16.0759L23.136 14.958C23.136 14.958 23.329 15.172 23.715 15.6001C24.105 16.0243 24.455 16.4906 24.765 16.9989C25.074 17.5072 25.309 18.0422 25.47 18.604C25.63 19.1658 25.71 19.7735 25.71 20.4271C25.71 21.1073 25.626 21.7303 25.458 22.2959C25.29 22.8577 25.049 23.3966 24.736 23.9126C24.422 24.4247 24.077 24.8833 23.698 25.2884C23.324 25.6974 23.136 25.9018 23.136 25.9018L21.663 24.7839C21.663 24.7839 21.82 24.5948 22.133 24.2164C22.45 23.8419 22.726 23.4597 22.959 23.0698C23.196 22.6762 23.375 22.2673 23.498 21.843C23.624 21.415 23.687 20.943 23.687 20.4271Z"></path>
                                        <circle className="dark:fill-zinc-50 fill-zinc-900" cx="8.277" cy="20.466" r="1.8"></circle>
                                        <circle className="dark:fill-zinc-50 fill-zinc-900" cx="19.878" cy="20.466" r="1.8"></circle>
                                    </svg>

                                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-5 leading-tight">
                                        hi, i&apos;m tarunika.
                                    </h2>
                                    <p className="text-base md:text-lg leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
                                        this is just a place for my writing. random thoughts, small ideas, stuff i don&apos;t want to forget. pick something from the sidebar.
                                    </p>
                                </div>

                                {/* ASCII art footer */}
                                <div className="px-10 md:px-16 pb-8 pt-16 flex justify-center max-w-full overflow-hidden">
                                    <div className="text-[8px] md:text-[11px] font-mono leading-[1.15] text-zinc-200 dark:text-zinc-800 whitespace-pre opacity-40 hover:opacity-70 transition-opacity duration-700 overflow-x-auto max-w-full">
                                        {`████████╗ █████╗ ██████╗ ██╗   ██╗███╗   ██╗██╗██╗  ██╗ █████╗ 
╚══██╔══╝██╔══██╗██╔══██╗██║   ██║████╗  ██║██║██║ ██╔╝██╔══██╗
   ██║   ███████║██████╔╝██║   ██║██╔██╗ ██║██║█████╔╝ ███████║
   ██║   ██╔══██║██╔══██╗██║   ██║██║╚██╗██║██║██╔═██╗ ██╔══██║
   ██║   ██║  ██║██║  ██║╚██████╔╝██║ ╚████║██║██║  ██╗██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝`}
                                    </div>
                                </div>
                            </div>
                        ) : viewState.type === 'folder' ? (
                            <div className="p-12 md:p-16 max-w-6xl mx-auto w-full">
                                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border-subtle">
                                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-border-subtle">
                                        <Search size={24} className="text-foreground" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-foreground capitalize tracking-tight">
                                            {viewState.name}
                                        </h2>
                                        <p className="text-sm text-muted-text mt-1">
                                            {SITE_CONTENT.filter(f => f.folder === viewState.name).length} documents
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {SITE_CONTENT.filter(f => f.folder === viewState.name).map(file => (
                                        <button
                                            key={file.id}
                                            onClick={() => handleFileClick(file.id)}
                                            className="group flex flex-col items-start p-6 rounded-2xl border border-border-subtle hover:border-zinc-400 dark:hover:border-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 transition-all text-left shadow-sm hover:shadow-md"
                                        >
                                            <div className="mb-4 p-2 bg-white dark:bg-zinc-800 rounded-lg border border-border-subtle shadow-sm group-hover:scale-105 transition-transform">
                                                <Terminal size={20} className="text-zinc-500 group-hover:text-foreground transition-colors" />
                                            </div>
                                            <span className="text-base font-semibold text-foreground mb-2 group-hover:underline decoration-1 underline-offset-4 decoration-zinc-300">
                                                {file.title}
                                            </span>
                                            <span className="text-xs text-muted-text line-clamp-2 leading-relaxed">
                                                {getContentPreview(file.content as string)}
                                            </span>
                                            <span className="text-[11px] text-muted-text mt-3 font-mono">
                                                {calculateReadingTime(file.content as string)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : activeFile ? (
                            <div className="flex gap-0 relative">
                                {/* Article Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="max-w-3xl mx-auto w-full py-16 px-8 md:px-12">
                                        {/* Post header */}
                                        <div className="mb-12">
                                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
                                                {activeFile.title}
                                            </h1>
                                            <div className="flex items-center gap-3 text-sm text-muted-text font-mono pb-6 border-b border-border-subtle">
                                                <span className="bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs font-medium capitalize border border-border-subtle">
                                                    {activeFile.folder}
                                                </span>
                                                <span className="text-zinc-300 dark:text-zinc-600">|</span>
                                                <span>{calculateReadingTime(activeFile.content as string)}</span>
                                            </div>
                                        </div>

                                        {/* Mobile TOC */}
                                        {tocItems.length > 1 && (
                                            <div className="xl:hidden mb-8 border border-border-subtle rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => setMobileTocOpen(!mobileTocOpen)}
                                                    className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-foreground bg-zinc-50 dark:bg-zinc-900"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <List size={14} />
                                                        Table of Contents
                                                    </span>
                                                    <ChevronDown size={16} className={`transition-transform ${mobileTocOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {mobileTocOpen && (
                                                    <nav className="px-5 py-3 space-y-1 bg-background border-t border-border-subtle">
                                                        {tocItems.map(item => (
                                                            <button
                                                                key={item.id}
                                                                onClick={() => scrollToHeading(item.id)}
                                                                className={`block w-full text-left text-sm py-1.5 text-muted-text hover:text-foreground transition-colors ${item.level === 3 ? 'pl-4' : 'pl-0'
                                                                    } ${activeHeadingId === item.id ? 'text-foreground font-medium' : ''}`}
                                                            >
                                                                {item.text}
                                                            </button>
                                                        ))}
                                                    </nav>
                                                )}
                                            </div>
                                        )}

                                        {/* Prose — erudite-style formatting */}
                                        <article className="prose prose-zinc dark:prose-invert max-w-none
                                            prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-24 prose-headings:text-foreground
                                            prose-h1:text-[2rem] prose-h1:leading-tight prose-h1:mb-8
                                            prose-h2:text-[1.5rem] prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border-subtle
                                            prose-h3:text-[1.25rem] prose-h3:mt-10 prose-h3:mb-4
                                            prose-p:text-[1.125rem] prose-p:leading-[1.75] prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:mb-6
                                            prose-a:text-foreground prose-a:font-semibold prose-a:underline prose-a:decoration-2 prose-a:decoration-zinc-900/30 dark:prose-a:decoration-zinc-100/30 prose-a:underline-offset-[3px] hover:prose-a:decoration-zinc-900 dark:hover:prose-a:decoration-zinc-100
                                            prose-ul:my-6 prose-ul:list-disc prose-ol:my-6 prose-li:my-1.5 prose-li:text-zinc-700 dark:prose-li:text-zinc-300 prose-li:text-[1.125rem] prose-li:leading-[1.75]
                                            prose-code:text-[0.875rem] prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:font-mono prose-code:font-medium prose-code:text-zinc-800 dark:prose-code:text-zinc-200
                                            prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-pre:rounded-lg prose-pre:border prose-pre:border-zinc-800 prose-pre:shadow-lg prose-pre:my-8 prose-pre:overflow-x-auto
                                            prose-img:rounded-xl prose-img:shadow-md prose-img:border prose-img:border-border-subtle prose-img:my-8
                                            prose-blockquote:border-l-4 prose-blockquote:border-blue-500/50 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:pl-5 prose-blockquote:py-1 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-zinc-700 dark:prose-blockquote:text-zinc-300
                                            prose-strong:text-foreground prose-strong:font-bold
                                            prose-hr:border-border-subtle prose-hr:my-14
                                            prose-table:text-sm prose-table:my-8 prose-th:font-semibold prose-th:text-left prose-th:pb-3 prose-th:border-b-2 prose-th:border-zinc-200 dark:prose-th:border-zinc-700 prose-td:py-2.5 prose-td:border-b prose-td:border-zinc-100 dark:prose-td:border-zinc-800
                                            prose-em:text-zinc-600 dark:prose-em:text-zinc-400
                                        ">
                                            <ReactMarkdown
                                                rehypePlugins={[rehypeRaw]}
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ children, ...props }) => {
                                                        const text = typeof children === 'string' ? children : String(children);
                                                        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                                        return <h1 id={id} {...props}>{children}</h1>;
                                                    },
                                                    h2: ({ children, ...props }) => {
                                                        const text = typeof children === 'string' ? children : String(children);
                                                        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                                        return <h2 id={id} {...props}>{children}</h2>;
                                                    },
                                                    h3: ({ children, ...props }) => {
                                                        const text = typeof children === 'string' ? children : String(children);
                                                        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                                        return <h3 id={id} {...props}>{children}</h3>;
                                                    },
                                                    // @ts-ignore
                                                    terminal: ({ node, ...props }) => <Terminal {...props} size={18} className="inline-block mr-2 align-text-bottom" />,
                                                    // @ts-ignore
                                                    cpu: ({ node, ...props }) => <Cpu {...props} size={18} className="inline-block mr-2 align-text-bottom" />,
                                                    code({ node, inline, className, children, ...props }: any) {
                                                        const match = /language-(\w+)/.exec(className || '');
                                                        if (!inline && match && match[1] === 'mermaid') {
                                                            return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                                                        }
                                                        return <code className={className} {...props}>{children}</code>;
                                                    }
                                                }}
                                            >
                                                {activeFile.content as string}
                                            </ReactMarkdown>
                                        </article>

                                        {/* Paper specific details (PDF viewer) */}
                                        {activeFile.folder === 'papers' && (
                                            <div className="mt-16 space-y-10">
                                                {activeFile.abstract && (
                                                    <div className="p-8 bg-blue-50/30 dark:bg-blue-950/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
                                                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                                            <FileText size={18} className="text-blue-500" />
                                                            Abstract
                                                        </h3>
                                                        <p className="text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                                                            {activeFile.abstract}
                                                        </p>
                                                        {(activeFile.journal || activeFile.year) && (
                                                            <div className="mt-6 pt-4 border-t border-blue-100/50 dark:border-blue-900/20 flex gap-6 text-xs font-mono text-zinc-500">
                                                                {activeFile.journal && <div><span className="text-zinc-400">Published in:</span> {activeFile.journal}</div>}
                                                                {activeFile.year && <div><span className="text-zinc-400">Year:</span> {activeFile.year}</div>}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="rounded-2xl border border-border-subtle overflow-hidden bg-zinc-50 dark:bg-zinc-900 shadow-sm">
                                                    <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-white dark:bg-zinc-800/50">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                            <FileText size={16} />
                                                            <span>PDF Document Explorer</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <a 
                                                                href={`/papers/${activeFile.fileName}`} 
                                                                download
                                                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-muted-text hover:text-foreground transition-colors"
                                                                title="Download PDF"
                                                            >
                                                                <Download size={18} />
                                                            </a>
                                                            <a 
                                                                href={`/papers/${activeFile.fileName}`} 
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-muted-text hover:text-foreground transition-colors"
                                                                title="Open in new tab"
                                                            >
                                                                <ExternalLink size={18} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="aspect-[3/4] md:aspect-video w-full">
                                                        <iframe 
                                                            src={`/papers/${activeFile.fileName}#zoom=100`} 
                                                            className="w-full h-full border-none"
                                                            title={activeFile.title}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* End ornament */}
                                        <div className="mt-24 pt-10 border-t border-border-subtle flex flex-col items-center text-center">
                                            <div className="w-12 h-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-5" />
                                        </div>

                                        {/* Previous / Next Navigation */}
                                        {(prevNextFiles.prev || prevNextFiles.next) && (
                                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {prevNextFiles.prev ? (
                                                    <button
                                                        onClick={() => handleFileClick(prevNextFiles.prev!.id)}
                                                        className="group flex items-center gap-3 p-5 rounded-xl border border-border-subtle hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors text-left"
                                                    >
                                                        <ArrowLeft size={16} className="text-muted-text group-hover:text-foreground transition-colors shrink-0" />
                                                        <div className="min-w-0">
                                                            <div className="text-xs text-muted-text mb-1">Previous</div>
                                                            <div className="text-sm font-medium text-foreground truncate">{prevNextFiles.prev.title}</div>
                                                        </div>
                                                    </button>
                                                ) : <div />}
                                                {prevNextFiles.next ? (
                                                    <button
                                                        onClick={() => handleFileClick(prevNextFiles.next!.id)}
                                                        className="group flex items-center gap-3 p-5 rounded-xl border border-border-subtle hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors text-right sm:justify-end"
                                                    >
                                                        <div className="min-w-0">
                                                            <div className="text-xs text-muted-text mb-1">Next</div>
                                                            <div className="text-sm font-medium text-foreground truncate">{prevNextFiles.next.title}</div>
                                                        </div>
                                                        <ArrowRight size={16} className="text-muted-text group-hover:text-foreground transition-colors shrink-0" />
                                                    </button>
                                                ) : <div />}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Sticky Table of Contents (Desktop) */}
                                {tocItems.length > 1 && (
                                    <aside className="hidden xl:block w-56 shrink-0 border-l border-border-subtle">
                                        <div className="sticky top-0 max-h-screen overflow-y-auto pr-4 pl-5 py-8">
                                            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-text/80 mb-4">
                                                On This Page
                                            </h4>
                                            <nav className="space-y-0.5">
                                                {tocItems.map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => scrollToHeading(item.id)}
                                                        className={`block w-full text-left text-[13px] py-1.5 transition-colors leading-snug border-l-2 ${activeHeadingId === item.id
                                                            ? 'border-foreground text-foreground font-medium'
                                                            : 'border-transparent text-muted-text hover:text-foreground hover:border-zinc-300 dark:hover:border-zinc-600'
                                                            }`}
                                                        style={{
                                                            paddingLeft: item.level === 2 ? '12px' : item.level === 3 ? '24px' : '12px',
                                                        }}
                                                    >
                                                        {item.text}
                                                    </button>
                                                ))}
                                            </nav>
                                        </div>
                                    </aside>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* Scroll to Top Button */}
                    <ScrollToTopButton scrollContainerRef={scrollContainerRef} />
                </main>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-[2px]"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
