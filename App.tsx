import React, { useState, useEffect, useCallback } from 'react';
import { PERSONAS } from './constants';
import * as geminiService from './services/geminiService';
import type { Persona, FinancingScenario, FAQItem } from './types';
import Card from './components/Card';
import Spinner from './components/Spinner';
import ApiKeyStatus from './components/ApiKeyStatus';
import ApiKeyManager from './components/ApiKeyManager';
import WorkflowHero from './components/WorkflowHero';

type LoadingStates = {
    benefits: boolean;
    image: boolean;
    financing: boolean;
    faq: boolean;
};

const App: React.FC = () => {
    const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(false);
    const [userApiKey, setUserApiKey] = useState<string>('');

    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
    const [customData, setCustomData] = useState<string>('');
    const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

    const [benefits, setBenefits] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [financingScenarios, setFinancingScenarios] = useState<FinancingScenario[]>([]);
    const [faq, setFaq] = useState<FAQItem[]>([]);

    const [loading, setLoading] = useState<LoadingStates>({
        benefits: false,
        image: false,
        financing: false,
        faq: false,
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key') || '';
        setUserApiKey(storedKey);
    }, []);

    useEffect(() => {
        const envKey = process.env.API_KEY;
        const keyToUse = userApiKey || envKey;

        if (keyToUse) {
            geminiService.updateApiKey(keyToUse);
            setApiKeyAvailable(true);
        } else {
            geminiService.updateApiKey('');
            setApiKeyAvailable(false);
        }
    }, [userApiKey]);

    const handleUserApiKeyChange = (key: string) => {
        setUserApiKey(key);
        localStorage.setItem('gemini_api_key', key);
    };

    const resetState = () => {
        setBenefits('');
        setImageUrl('');
        setFinancingScenarios([]);
        setFaq([]);
        setError(null);
        setLoading({ benefits: false, image: false, financing: false, faq: false });
    };

    const handlePersonaSelect = (persona: Persona) => {
        resetState();
        setSelectedPersona(persona);
        setIsCustomMode(false);
        setCustomData('');
        generateContent(persona.prompt);
    };

    const handleCustomDataSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!customData.trim()) return;
        resetState();
        setSelectedPersona(null);
        setIsCustomMode(true);
        generateContent(customData);
    };
    
    const generateContent = useCallback(async (prompt: string) => {
        try {
            setLoading(prev => ({ ...prev, benefits: true }));
            const benefitsResult = await geminiService.generateBenefits(prompt);
            setBenefits(benefitsResult);
            setLoading(prev => ({ ...prev, benefits: false, image: true }));
            
            const imageResult = await geminiService.generateImage(benefitsResult);
            setImageUrl(imageResult);
            setLoading(prev => ({ ...prev, image: false, financing: true }));

            const financingResult = await geminiService.generateFinancingScenarios(prompt);
            setFinancingScenarios(financingResult);
            setLoading(prev => ({ ...prev, financing: false }));

        } catch (err) {
            setError('An error occurred while generating content. Please try again.');
            console.error(err);
            setLoading({ benefits: false, image: false, financing: false, faq: false });
        }
    }, []);

    const handleGenerateFaq = async () => {
        const prompt = selectedPersona?.prompt || customData;
        if (!prompt || !benefits) return;
        
        try {
            setLoading(prev => ({ ...prev, faq: true }));
            const faqResult = await geminiService.generateFaq(prompt, benefits);
            setFaq(faqResult);
        } catch (err) {
            setError('Failed to generate FAQ.');
        } finally {
            setLoading(prev => ({ ...prev, faq: false }));
        }
    };
    
    const activePrompt = selectedPersona || isCustomMode;

    return (
        <div className="min-h-screen bg-gray-100 text-[#333333]">
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#333333]">SolarGenius Presenter</h1>
                <ApiKeyStatus isAvailable={apiKeyAvailable} />
            </header>

            <main className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Sidebar --- */}
                <aside className="lg:col-span-1 space-y-6">
                    <Card title="Settings">
                        <ApiKeyManager apiKey={userApiKey} onApiKeyChange={handleUserApiKeyChange} />
                    </Card>
                    <Card title="1. Select Customer Persona">
                        <div className="space-y-3">
                            {PERSONAS.map((persona) => (
                                <button
                                    key={persona.id}
                                    onClick={() => handlePersonaSelect(persona)}
                                    className={`w-full text-left p-4 rounded-md transition-all duration-200 ${selectedPersona?.id === persona.id ? 'bg-[#ffeb3b] text-[#333333] shadow-md' : 'bg-white/50 hover:bg-white/80'}`}
                                >
                                    <h4 className="font-bold text-lg">{persona.name}</h4>
                                    <p className="text-sm">{persona.description}</p>
                                </button>
                            ))}
                        </div>
                    </Card>
                    <Card title="Or Enter Custom Data">
                        <form onSubmit={handleCustomDataSubmit} className="space-y-3">
                             <textarea
                                value={customData}
                                onChange={(e) => setCustomData(e.target.value)}
                                placeholder="e.g., 'A retired couple interested in stable, long-term investments and reducing their monthly expenses.'"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ffeb3b] focus:border-transparent"
                                rows={4}
                            />
                            <button type="submit" className="w-full bg-[#333333] text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors">
                                Generate from Custom Data
                            </button>
                        </form>
                    </Card>
                </aside>

                {/* --- Content Area --- */}
                <section className="lg:col-span-2 space-y-8">
                    <WorkflowHero />
                    {!activePrompt && (
                        <Card>
                            <div className="text-center py-16">
                                <h2 className="text-2xl font-bold">Welcome, Solar Agent!</h2>
                                <p className="mt-2">Follow the steps above to generate a presentation.</p>
                            </div>
                        </Card>
                    )}
                    {error && <Card className="bg-red-200 text-red-800">{error}</Card>}

                    {activePrompt && (
                        <>
                            <Card title="2. Solar Technology Benefits">
                                {loading.benefits ? <Spinner message="Generating personalized benefits..."/> : <p className="text-lg leading-relaxed">{benefits}</p>}
                            </Card>

                            <Card title="3. Lifestyle Imagery">
                                {loading.image ? <Spinner message="Creating inspirational imagery..."/> : imageUrl && <img src={imageUrl} alt="Happy homeowners with solar panels" className="rounded-lg shadow-md w-full object-cover" />}
                            </Card>

                            <Card title="4. Comparative Financing Scenarios">
                                {loading.financing ? <Spinner message="Calculating financing options..."/> : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b-2 border-[#333333]">
                                                    <th className="p-3 text-lg font-bold">Option</th>
                                                    <th className="p-3 text-lg font-bold">Pros</th>
                                                    <th className="p-3 text-lg font-bold">Cons</th>
                                                    <th className="p-3 text-lg font-bold">Best For</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {financingScenarios.map((scenario) => (
                                                    <tr key={scenario.option} className="border-b border-white/50 last:border-b-0">
                                                        <td className="p-3 font-bold align-top">{scenario.option}</td>
                                                        <td className="p-3 align-top">
                                                            <ul className="list-disc list-inside">
                                                                {scenario.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                                                            </ul>
                                                        </td>
                                                        <td className="p-3 align-top">
                                                            <ul className="list-disc list-inside">
                                                                {scenario.cons.map((con, i) => <li key={i}>{con}</li>)}
                                                            </ul>
                                                        </td>
                                                        <td className="p-3 align-top">{scenario.bestFor}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card>

                            <Card title="5. Frequently Asked Questions">
                                {faq.length === 0 && (
                                    <button
                                        onClick={handleGenerateFaq}
                                        disabled={loading.faq || !benefits}
                                        className="w-full bg-[#ffeb3b] text-[#333333] font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading.faq ? 'Generating...' : 'Generate FAQ'}
                                    </button>
                                )}
                                {loading.faq && faq.length === 0 && <Spinner message="Preparing common questions..."/>}
                                {faq.length > 0 && (
                                    <div className="space-y-4">
                                        {faq.map((item, index) => (
                                            <div key={index}>
                                                <h4 className="font-bold text-lg">{item.question}</h4>
                                                <p>{item.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};

export default App;
