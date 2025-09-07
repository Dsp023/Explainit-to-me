import React, { useState, useRef } from 'react';

// Get API key from environment variables
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const ExplainEngine = () => {
    const [level, setLevel] = useState(2); // Default to "Detailed"
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const textareaRef = useRef(null);
    const outputRef = useRef(null);
    
    const levels = [
        { value: 0, label: "Child", prompt: "Explain this to me like I'm 5 years old. Use simple words and concepts." },
        { value: 1, label: "Simple", prompt: "Explain this in simple terms that anyone can understand." },
        { value: 2, label: "Detailed", prompt: "Provide a detailed explanation of this concept." },
        { value: 3, label: "Academic", prompt: "Give me an academic explanation with proper terminology and context." },
        { value: 4, label: "Expert", prompt: "Provide an expert-level explanation with advanced concepts and details." }
    ];

    const handleExplain = async () => {
        const textToExplain = textareaRef.current?.value.trim();
        if (!textToExplain) {
            setError('Please enter some text to explain.');
            return;
        }

        if (!GROQ_API_KEY) {
            setError('Please set your Groq API key in the .env file as VITE_GROQ_API_KEY');
            return;
        }

        setIsLoading(true);
        setError('');
        setOutput('<p class="text-blue-400">Generating explanation...</p>');

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'openai/gpt-oss-20b',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a helpful AI assistant that explains complex topics in simple terms. ${levels[level].prompt}`
                        },
                        {
                            role: 'user',
                            content: textToExplain
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 4096
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to get explanation');
            }

            const data = await response.json();
            const explanation = data.choices?.[0]?.message?.content || 'No explanation was generated.';
            setOutput(formatMarkdown(explanation));
        } catch (err) {
            console.error('Error:', err);
            setError(`Error: ${err.message}. Please try again.`);
            setOutput('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        if (textareaRef.current) {
            textareaRef.current.value = '';
        }
        setOutput('');
        setError('');
    };

    const handleExport = () => {
        if (!output) return;
        
        const element = document.createElement('a');
        const file = new Blob([output.replace(/<[^>]*>?/gm, '')], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `explanation-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const formatMarkdown = (text) => {
        // Handle tables
        const tableRegex = /\|(.+)\|\n\|(?:[-:]+\|)+\n((?:\|.*\|\n)+)/g;
        let formattedText = text;
        
        // Process tables
        formattedText = formattedText.replace(tableRegex, (match, header, rows) => {
            const headers = header.split('|').map(h => h.trim()).filter(Boolean);
            const rowData = rows.trim().split('\n').map(row => 
                row.split('|').map(cell => cell.trim()).filter((_, i) => i > 0 && i < headers.length + 1)
            );
            
            return `
                <div class="overflow-x-auto my-4">
                    <table class="min-w-full border border-gray-600">
                        <thead>
                            <tr class="bg-gray-700">
                                ${headers.map(h => `<th class="px-4 py-2 text-left border-b border-gray-600">${h}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${rowData.map(row => `
                                <tr class="border-b border-gray-700">
                                    ${row.map(cell => `<td class="px-4 py-2">${cell}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        });

        // Handle lists (both ordered and unordered)
        formattedText = formattedText.replace(/^[\s]*[-*]\s+(.*$)/gm, '• $1');
        
        // Handle numbered lists
        formattedText = formattedText.replace(/^(\d+\.\s+)(.*$)/gm, '$1$2');
        
        // Convert list items to HTML
        formattedText = formattedText.replace(/^(•|\d+\.)\s+(.*)$/gm, 
            '<div class="flex items-start mb-1"><span class="mr-2">$1</span><span>$2</span></div>');

        // Handle bold text
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic text
        formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Handle code blocks (without background highlight)
        formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="font-mono text-gray-300">$1</code>');
        
        // Handle headings with proper spacing
        formattedText = formattedText
            .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-2 text-blue-300">$1</h3>')
            .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-3 text-blue-200">$1</h2>')
            .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-10 mb-4 text-blue-100">$1</h1>');
        
        // Replace double line breaks with paragraph tags for better spacing
        formattedText = formattedText.replace(/\n\n/g, '</p><p class="my-3">');
        
        // Wrap the whole content in a paragraph if it's not already in a tag
        if (!formattedText.startsWith('<')) {
            formattedText = `<p class="my-3">${formattedText}</p>`;
        }
        
        return formattedText;
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <header className="text-center mb-6 pt-2">
                <h1 className="text-4xl font-bold text-white">The "Explain It To Me" Engine</h1>
                <p className="text-gray-400">Paste in complex text and get a simple explanation.</p>
            </header>

            <main className="bg-gray-800 p-8 rounded-lg shadow-2xl">
                {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-md">
                        {error}
                    </div>
                )}
                
                <div className="mb-6">
                    <label htmlFor="text-input" className="block text-gray-400 text-sm font-bold mb-2">
                        Your Text:
                    </label>
                    <textarea 
                        ref={textareaRef}
                        id="text-input" 
                        className="bg-gray-900 text-gray-200 shadow appearance-none border-2 border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500 h-48 resize-none" 
                        placeholder="Paste your complex text here..."
                        disabled={isLoading}
                    ></textarea>
                </div>

                <div className="mb-6">
                    <label htmlFor="level-slider" className="block text-gray-400 text-xs font-bold mb-2">
                        EXPLANATION LEVEL: <span className="font-normal text-blue-400">{levels[level].label}</span>
                    </label>
                    <input 
                        type="range" 
                        id="level-slider" 
                        min="0" 
                        max="4" 
                        value={level} 
                        onChange={(e) => setLevel(parseInt(e.target.value))} 
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer" 
                        disabled={isLoading}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        {levels.map((lvl) => (
                            <span key={lvl.value} className={level === lvl.value ? 'text-blue-400' : ''}>
                                {lvl.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="text-center mb-6">
                    <button 
                        id="explain-button" 
                        onClick={handleExplain}
                        disabled={isLoading}
                        className={`${isLoading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105`}
                    >
                        {isLoading ? 'Explaining...' : 'Explain'}
                    </button>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
                        <h3 className="text-lg font-bold text-white">Explanation</h3>
                        <div className="flex items-center gap-2">
                            <button 
                                id="clear-button" 
                                onClick={handleClear}
                                disabled={isLoading}
                                className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 border border-red-700 hover:border-red-600 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Clear</span>
                            </button>
                            <button 
                                id="export-button" 
                                onClick={handleExport}
                                disabled={isLoading || !output}
                                className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 border border-green-700 hover:border-green-600 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                    <div 
                        ref={outputRef}
                        id="output-display" 
                        className="bg-gray-900 p-4 rounded-md border border-gray-700 min-h-[10rem] text-gray-200 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: output || '<p class="text-gray-500 italic">Your explanation will appear here...</p>' }}
                    >
                    </div>
                </div>
            </main>

            <footer className="text-center mt-10 p-4 border-t border-gray-700">
                <p className="text-gray-500 text-sm">
                    Created by <a href="#" className="text-blue-400 hover:text-blue-500">Nakka Devi Sri Prasad</a> | 
                    <a href="https://github.com/Dsp023" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">GitHub</a>
                </p>
            </footer>
        </div>
    );
}

export default ExplainEngine;
