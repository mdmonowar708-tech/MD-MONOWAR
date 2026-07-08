import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import html2pdf from 'html2pdf.js';

export const QuestionGenerator: React.FC = () => {
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
            
            let i = 0;
            const total = snapshot.size;
            snapshot.forEach((qSnap) => {
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
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                
                html2pdf().set(opt).from(container).save().catch((err) => console.error("PDF generation error:", err));
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">PDF বুকলেট জেনারেটর</h2>
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
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    {loading ? 'লোড হচ্ছে...' : 'PDF ডাউনলোড করুন'}
                </button>
            </div>
            <div id="pdf-booklet-container" className="mt-8"></div>
        </div>
    );
};