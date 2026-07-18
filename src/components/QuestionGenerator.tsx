import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import html2pdf from 'html2pdf.js';

interface QuestionGeneratorProps {
    isPremium?: boolean;
    onUpgrade?: () => void;
}

export const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({ isPremium = false, onUpgrade }) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const qRef = collection(db, "categories");
                const snapshot = await getDocs(qRef);
                const cats = snapshot.docs.map(doc => doc.data().name);
                setCategories(cats);
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        loadCategories();
    }, []);

    const handleCategoryChange = async (cat: string) => {
        setSelectedCategory(cat);
        setSelectedSubCategory('');
        setSubCategories([]);
        if (!cat) return;

        try {
            const qRef = collection(db, "subcategories");
            const qQuery = query(qRef, where("category", "==", cat));
            const snapshot = await getDocs(qQuery);
            const subCats = snapshot.docs.map(doc => doc.data().name);
            setSubCategories(subCats);
        } catch (error) {
            console.error("Error loading subcategories:", error);
        }
    };

    const generatePDF = async () => {
        if (!selectedCategory || !selectedSubCategory) return;
        setLoading(true);
        
        try {
            const qRef = collection(db, "questions");
            const qQuery = query(qRef, where("category", "==", selectedCategory), where("subcategory", "==", selectedSubCategory));
            const snapshot = await getDocs(qQuery);
            
            const container = document.getElementById('pdf-booklet-container');
            if (!container) return;
            container.innerHTML = '';
            
            let docs = snapshot.docs;
            const fullTotal = docs.length;

            // Enforce limit of 10 questions for free users
            if (!isPremium) {
                docs = docs.slice(0, 10);
            }
            
            let i = 0;
            const total = docs.length;
            docs.forEach((qSnap) => {
                i++;
                const qData = qSnap.data();
                const page = document.createElement('div');
                page.className = 'pdf-page-content';
                page.style.cssText = "background: white; padding: 40px; border-radius: 8px; width: 100%; max-width: 595px; min-height: 842px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #E2E8F0; box-sizing: border-box; position: relative; overflow: hidden; margin-bottom: 20px;";
                page.innerHTML = `
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 0;">
                        <div style="transform: rotate(-45deg); color: rgba(200, 200, 200, 0.3); font-size: 50px; font-weight: bold; text-transform: uppercase; white-space: nowrap;">MCQ HERO - COPYRIGHT</div>
                    </div>
                    <div class="doc-title-element" style="position: absolute; top: 20px; left: 0; right: 0; text-align: center; color: #64748B; font-size: 12px; font-weight: bold; text-transform: uppercase; z-index: 1;">${selectedCategory} - ${selectedSubCategory}</div>
                    <h3 style="margin-top: 40px; position: relative; z-index: 1;">প্রশ্ন ${i}</h3>
                    <p style="position: relative; z-index: 1;">${qData.question || ""}</p>
                    <div style="position: relative; z-index: 1;">
                        <p>A) ${qData.option1 || ""}</p>
                        <p>B) ${qData.option2 || ""}</p>
                        <p>C) ${qData.option3 || ""}</p>
                        <p>D) ${qData.option4 || ""}</p>
                    </div>
                    <div class="page-number-element" style="position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; color: #94A3B8; font-size: 14px; font-weight: 500; z-index: 1;">${selectedCategory} - ${selectedSubCategory} | পৃষ্ঠা ${i} / ${total}</div>
                `;
                container.appendChild(page);
            });

            if (i > 0) {
                const opt = {
                    margin: 10,
                    filename: 'booklet.pdf',
                    image: { type: 'jpeg' as const, quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
                };
                
                html2pdf().set(opt).from(container).save().then(() => {
                    if (!isPremium && fullTotal > 10) {
                        alert(`বুকলেট ডাউনলোড হয়েছে! আপনি ফ্রি ইউজার হওয়ায় ১০ টি প্রশ্ন ডাউনলোড হয়েছে (মোট প্রশ্ন ছিল ${fullTotal} টি)। সব প্রশ্ন ডাউনলোড করতে প্রিমিয়াম মেম্বারশিপে আপগ্রেড করুন।`);
                    }
                }).catch((err) => console.error("PDF generation error:", err));
            } else {
                alert("কোনো প্রশ্ন পাওয়া যায়নি।");
            }
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("পিডিএফ জেনারেট করতে ব্যর্থ হয়েছে: " + (error as Error).message);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PDF বুকলেট জেনারেটর</h2>
            
            {/* Subscription status notice */}
            <div className="mb-6">
                {isPremium ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center justify-between">
                        <span className="font-semibold">🌟 প্রিমিয়াম মেম্বারশিপ সচল</span>
                        <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full uppercase text-[9px]">unlimited</span>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">⚠️ ফ্রি ইউজার লিমিট অ্যাক্টিভ</span>
                            <span className="bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full uppercase text-[9px]">Max 10 Qs</span>
                        </div>
                        <p className="leading-relaxed">ফ্রি ইউজার হিসেবে আপনি সর্বোচ্চ ১০ টি প্রশ্ন সম্বলিত পিডিএফ বুকলেট ডাউনলোড করতে পারবেন। সব প্রশ্ন সহ ডাউনলোড করতে প্রিমিয়াম মেম্বারশিপে আপগ্রেড করুন।</p>
                        {onUpgrade && (
                            <button 
                                onClick={onUpgrade}
                                className="w-full mt-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors cursor-pointer border-none"
                            >
                                প্রিমিয়াম মেম্বারশিপ নিন (সব প্রশ্ন আনলক)
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">বিষয়</label>
                    <select 
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 border"
                    >
                        <option value="">বিষয় নির্বাচন করুন</option>
                        {categories && categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">সাব-ক্যাটাগরি</label>
                    <select 
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        disabled={!selectedCategory}
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 border disabled:bg-gray-100"
                    >
                        <option value="">{selectedCategory ? 'সাব-ক্যাটাগরি নির্বাচন করুন' : 'আগে ক্যাটাগরি নির্বাচন করুন'}</option>
                        {subCategories && subCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                    </select>
                </div>
                <button 
                    onClick={generatePDF} 
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                >
                    {loading ? 'লোড হচ্ছে...' : 'PDF ডাউনলোড করুন'}
                </button>
            </div>
            <div id="pdf-booklet-container" className="mt-8"></div>
        </div>
    );
};