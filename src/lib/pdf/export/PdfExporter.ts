import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

export class PdfExporter {
  /**
   * Exports the rendered DOM pages to a professional, multi-page, A4-portrait PDF.
   * Leverages progressive, sequential rendering to support 100, 500, 1000, 3000+ questions
   * with minimal memory footprint by clearing/releasing canvases page-by-page.
   */
  public async exportToPdf(element: HTMLElement, filename: string): Promise<void> {
    try {
      const finalFilename = this.formatFilename(element, filename);
      
      const virtualPages = (window as any).paginatedVirtualPages;
      const config = (window as any).pdfEngineConfig;
      const title = (window as any).pdfDocTitle || '';

      // Initialize jsPDF targeting A4 dimensions (595.28 pt width x 841.89 pt height)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        compress: true
      });

      let totalPages = 0;
      if (virtualPages && virtualPages.length > 0) {
        totalPages = virtualPages.length;
      } else {
        // Fallback to DOM elements if virtualPages data is not set
        const pages = Array.from(element.querySelectorAll('.pdf-page-content')) as HTMLElement[];
        totalPages = pages.length;
        if (totalPages === 0) {
          console.warn("No structured pages (.pdf-page-content) found inside the container. Exporting fallback canvas.");
          const canvas = await html2canvas(element, {
            scale: 1.5,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89);
          canvas.width = 0;
          canvas.height = 0;
          pdf.save(finalFilename);
          return;
        }
      }

      // Determine adaptive scale factor to optimize output quality while avoiding browser crashes on extremely large booklets
      let scaleVal = 2;
      if (totalPages > 50) {
        scaleVal = 1.0; // Ultra-safe scale for 3000+ questions to keep memory overhead very low
      } else if (totalPages > 15) {
        scaleVal = 1.5; // Balanced high quality and safe memory footprint
      }

      // Check for cover page element and render it first if present
      let hasCover = false;
      const coverPageEl = element.querySelector('.cover-page-element') as HTMLElement | null;
      if (coverPageEl) {
        hasCover = true;
        if (typeof (window as any).updatePdfLoaderProgress === 'function') {
          (window as any).updatePdfLoaderProgress(30, 'কভার পেজ তৈরি হচ্ছে...');
        }
        await document.fonts.ready;
        const coverCanvas = await html2canvas(coverPageEl, {
          scale: scaleVal,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 595,
          height: 842,
          scrollX: 0,
          scrollY: 0
        });
        const coverImgData = coverCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(coverImgData, 'JPEG', 0, 0, 595.28, 841.89);
        coverCanvas.width = 0;
        coverCanvas.height = 0;
      }

      // Render pages sequentially (streaming) to avoid parallel rendering memory spikes
      for (let i = 0; i < totalPages; i++) {
        // Report incremental progress via the global progress indicator
        if (typeof (window as any).updatePdfLoaderProgress === 'function') {
          const percent = 40 + Math.floor((i / totalPages) * 55); // progressive scale from 40% to 95%
          (window as any).updatePdfLoaderProgress(percent, `পিডিএফ তৈরি হচ্ছে... (পৃষ্ঠা ${i + 1}/${totalPages})`);
        }

        // Ensure all fonts are fully loaded prior to rendering
        await document.fonts.ready;

        let pageEl: HTMLElement | null = null;
        let isTemporary = false;
        let tempContainer: HTMLDivElement | null = null;

        // Try to find the page inside the DOM first
        const pagePlaceholder = element.querySelector(`[data-page-index="${i}"]`) as HTMLElement | null;
        if (pagePlaceholder && pagePlaceholder.getAttribute('data-rendered') === 'true') {
          // Avoid duplicate rendering - use the already rendered preview page directly!
          pageEl = pagePlaceholder;
        } else if (virtualPages && virtualPages[i]) {
          // Never build the entire DOM before export. Render sequentially on-the-fly and destroy!
          isTemporary = true;
          const renderEngine = new (window as any).RenderEngine();
          pageEl = renderEngine.renderPage(title, virtualPages[i], totalPages, config);
          
          // Append to a hidden isolated container to measure/render properly
          tempContainer = document.createElement('div');
          tempContainer.className = 'pdf-temporary-export-container';
          tempContainer.style.cssText = 'position: absolute; left: -10000px; top: -10000px; width: 595px; height: 842px; overflow: hidden; background: white;';
          tempContainer.appendChild(pageEl!);
          document.body.appendChild(tempContainer);
        } else {
          // Fallback to DOM if virtualPages is not loaded
          const pages = Array.from(element.querySelectorAll('.pdf-page-content')) as HTMLElement[];
          pageEl = pages[i];
        }

        if (!pageEl) {
          console.warn(`Page element at index ${i} could not be resolved.`);
          continue;
        }

        // Trigger reflow/layout flush to force the browser to compute styling/geometry
        const _triggerReflow = pageEl.offsetHeight;

        // Wait until any asynchronous updates have fully flushed and rendered
        await new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 50); // Small 50ms buffer to allow full painting and layout settlement
          });
        });

        // Render current page to canvas with explicit settings to avoid layout shift or cut-off content
        let canvas = await html2canvas(pageEl, {
          scale: scaleVal,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 595,
          height: 842,
          scrollX: 0,
          scrollY: 0
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        // Add page break in jsPDF for all but the very first page, or if we already added a cover page
        if (hasCover || i > 0) {
          pdf.addPage();
        }

        // Place image on the page fitting exactly to A4
        pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89);

        // Destroy canvas immediately after each page is exported & Ensure memory is released
        canvas.width = 0;
        canvas.height = 0;
        (canvas as any) = null;

        // Clean up temporary DOM element to release memory immediately
        if (isTemporary && tempContainer) {
          tempContainer.remove();
          tempContainer = null;
          pageEl = null;
        }
      }

      // Save and download the final PDF booklet
      pdf.save(finalFilename);

    } catch (error) {
      console.error("Error during modern sequential PDF export:", error);
      console.log("Attempting fallback html2pdf.js export mechanism...");
      
      try {
        const cleanName = this.formatFilename(element, filename);
        const fallbackOpt = {
          margin: 0,
          filename: cleanName,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { scale: 1.5, useCORS: true, scrollY: 0, scrollX: 0 },
          jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: 'css' }
        };
        
        // Save using html2pdf
        await html2pdf().from(element).set(fallbackOpt).save();
      } catch (fallbackError) {
        console.error("Fallback PDF export failed completely:", fallbackError);
        alert("পিডিএফ ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
      }
    }
  }

  /**
   * Extracts Subject and Topic information directly from the rendered DOM tags or selection dropdowns
   * to construct the designated standardized file name format: MCQ_HERO_<Subject>_<Topic>.pdf
   */
  private formatFilename(element: HTMLElement, defaultFilename: string): string {
    let subject = 'Subject';
    let topic = 'Topic';

    // Look for Subject tag in the document page header
    const subjectEl = element.querySelector('.header-subject');
    if (subjectEl && subjectEl.textContent) {
      subject = subjectEl.textContent.replace(/^বিষয়:\s*/, '').trim();
    }
    // Look for Topic tag in the document page header
    const topicEl = element.querySelector('.header-topic');
    if (topicEl && topicEl.textContent) {
      topic = topicEl.textContent.replace(/^টপিক:\s*/, '').trim();
    }

    // Try fallback to select elements in the document body if header elements are absent
    if (subject === 'Subject' || topic === 'Topic') {
      const catSelect = document.getElementById('category-selector') as HTMLSelectElement | null;
      if (catSelect && catSelect.selectedIndex >= 0) {
        subject = catSelect.options[catSelect.selectedIndex].text;
      }
      const subcatSelect = document.getElementById('subcategory-selector') as HTMLSelectElement | null;
      if (subcatSelect && subcatSelect.selectedIndex >= 0) {
        topic = subcatSelect.options[subcatSelect.selectedIndex].text;
      }
    }

    // If still blank, fall back to default filename parsed values
    if (!subject || subject === 'Subject') {
      subject = defaultFilename.split('_')[0] || 'Subject';
    }
    if (!topic || topic === 'Topic') {
      topic = defaultFilename.split('_')[1] || 'Topic';
    }

    // Helper to sanitize filename by swapping unsafe characters for clean underscores
    const sanitize = (str: string) => str.replace(/[\/\\?%*:|"<>\s]+/g, '_');
    
    const cleanSubject = sanitize(subject);
    const cleanTopic = sanitize(topic);

    return `MCQ_HERO_${cleanSubject}_${cleanTopic}.pdf`;
  }
}
