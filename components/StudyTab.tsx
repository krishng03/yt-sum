import { IconLibraryPhoto, IconCamera, IconDownload, IconEye, IconMaximize, IconMinimize, IconDeviceFloppy, IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "./ui/button";
import YouTube from 'react-youtube';
import Editor from '@monaco-editor/react';
import { useState, useEffect, useCallback } from 'react';

interface StudyTabProps {
    url: string;
    notes?: string;
}

const StudyTab: React.FC<StudyTabProps> = ({ 
    url, 
    notes = "" 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [noteContent, setNoteContent] = useState(notes);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);


    const videoId = url.split('v=')[1];

    // Debounced save function
    const debouncedSave = useCallback(
        debounce(async (content: string) => {
            try {
                setSaveStatus('saving');
                setIsSaving(true);

                const response = await fetch('/api/video/notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        videoUrl: url,
                        notes: content,
                    }),
                });

                if (response.ok) {
                    setSaveStatus('saved');
                    setLastSaved(new Date());
                    setTimeout(() => setSaveStatus('idle'), 2000);
                } else {
                    const error = await response.json();
                    console.error('Failed to save notes:', error);
                    setSaveStatus('error');
                    setTimeout(() => setSaveStatus('idle'), 3000);
                }
            } catch (error) {
                console.error('Error saving notes:', error);
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } finally {
                setIsSaving(false);
            }
        }, 1000),
        [url]
    );

    const handleNotesChange = (value: string | undefined) => {
        const newContent = value || "";
        setNoteContent(newContent);
        
        // Auto-save notes after 1 second of no typing
        if (newContent !== notes) {
            debouncedSave(newContent);
        }
    };

    const toggleExpand = () => {
        console.log('Toggle expand clicked, current state:', isExpanded);
        setIsExpanded(prev => !prev);
    };

    const videoOpts = {
        height: '600',
        width: '100%',
        playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            fs: 1,
        },
    };

    const getSaveStatusIcon = () => {
        switch (saveStatus) {
            case 'saving':
                return <IconDeviceFloppy className="w-3 h-3 text-blue-400 animate-pulse" />;
            case 'saved':
                return <IconCheck className="w-3 h-3 text-green-400" />;
            case 'error':
                return <IconX className="w-3 h-3 text-red-400" />;
            default:
                return null;
        }
    };

    const getSaveStatusText = () => {
        switch (saveStatus) {
            case 'saving':
                return 'Saving...';
            case 'saved':
                return `Saved ${lastSaved?.toLocaleTimeString()}`;
            case 'error':
                return 'Failed to save';
            default:
                return 'All changes saved';
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl shadow-md border border-pink-200">
                <div className="flex items-center justify-between px-4 pt-4">
                    <div className="flex items-center gap-3 ">
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 mr-2">
                            <IconCamera className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">Study Mode</h2>
                            <p className="text-sm text-gray-600">Interactive learning experience</p>
                        </div>
                    </div>
                    
                    <Button
                        onClick={toggleExpand}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                        {isExpanded ? (
                            <>
                                <IconMinimize className="w-4 h-4" />
                                Collapse Notes
                            </>
                        ) : (
                            <>
                                <IconMaximize className="w-4 h-4" />
                                Expand Notes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Video Section */}
                <div 
                    className={`${
                        isExpanded ? 'w-1/2' : 'w-3/4'
                    } bg-black flex items-center justify-center transition-all duration-500 ease-in-out relative`}
                    style={{ minHeight: '600px' }}
                >
                    {videoId ? (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <div className="w-full" style={{ maxWidth: '100%', aspectRatio: '16/9' }}>
                                <YouTube
                                    videoId={videoId}
                                    opts={{
                                        ...videoOpts,
                                        height: '100%',
                                        width: '100%'
                                    }}
                                    className="w-full h-full"
                                    iframeClassName="w-full h-full rounded-lg"
                                    style={{ minHeight: '500px' }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-white text-center">
                            <IconEye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Invalid YouTube URL</p>
                            <p className="text-sm opacity-70">Please provide a valid YouTube video URL</p>
                        </div>
                    )}
                </div>

                {/* Notes Section */}
                <div 
                    className={`${
                        isExpanded ? 'w-1/2' : 'w-1/4'
                    } border-l border-gray-300 bg-gray-900 flex flex-col transition-all duration-500 ease-in-out`}
                >
                    {/* Notes Header */}
                    <div className="flex-shrink-0 bg-gray-800 px-4 py-3 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IconLibraryPhoto className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-300">Study Notes</span>
                                <span className="text-xs text-gray-500 ml-2">
                                    {isExpanded ? 'Expanded' : 'Compact'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            height="100%"
                            defaultLanguage="markdown"
                            value={noteContent}
                            onChange={handleNotesChange}
                            theme="vs-dark"
                            options={{
                                fontSize: isExpanded ? 15 : 13,
                                lineNumbers: 'on',
                                minimap: { enabled: isExpanded },
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                                automaticLayout: true,
                                folding: true,
                                lineHeight: 1.6,
                                padding: { top: 16, bottom: 16 },
                                fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
                                cursorBlinking: 'smooth',
                                renderLineHighlight: 'gutter',
                                selectOnLineNumbers: true,
                                bracketPairColorization: { enabled: true },
                            }}
                        />
                    </div>

                    {/* Notes Footer */}
                    <div className="flex-shrink-0 bg-gray-800 px-4 py-2 border-t border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center gap-2">
                                <span>Markdown • UTF-8</span>
                                {getSaveStatusIcon()}
                                <span className={`${
                                    saveStatus === 'error' ? 'text-red-400' : 
                                    saveStatus === 'saved' ? 'text-green-400' : 
                                    saveStatus === 'saving' ? 'text-blue-400' : 'text-gray-400'
                                }`}>
                                    {getSaveStatusText()}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span>Lines: {noteContent.split('\n').length}</span>
                                <span>Characters: {noteContent.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export default StudyTab;