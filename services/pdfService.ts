import { jsPDF } from "jspdf";
import { RedditPost } from '../types';

export async function generatePdf(
  title: string,
  story: string,
  imageBase64: string,
  posts: RedditPost[]
): Promise<void> {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // 1. Add Title
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  const titleLines = doc.splitTextToSize(title, maxWidth);
  doc.text(titleLines, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += (titleLines.length * 10) + 10;

  // 2. Add Image
  try {
    const imgProps = doc.getImageProperties(imageBase64);
    const imgWidth = maxWidth * 0.8; // Use 80% of page width
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    const imgX = (pageWidth - imgWidth) / 2;
    doc.addImage(imageBase64, 'JPEG', imgX, cursorY, imgWidth, imgHeight);
    cursorY += imgHeight + 15;
  } catch (e) {
    console.error("Could not add image to PDF:", e);
    // Continue without image if it fails
  }

  // 3. Add Story Text
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  const storyParagraphs = story.split('\n').filter(p => p.trim() !== '');

  for (const paragraph of storyParagraphs) {
    const lines = doc.splitTextToSize(paragraph, maxWidth);
    const textBlockHeight = lines.length * 5; // Approximate height

    if (cursorY + textBlockHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    
    doc.text(lines, margin, cursorY);
    cursorY += textBlockHeight + 5; // Add space between paragraphs
  }
  
  // 4. Add Source Links
  const linksHeader = "Source Material";
  const linksHeaderHeight = 10;
  const singleLinkHeight = 8; // Approx height for header + one link
  
  if (cursorY + linksHeaderHeight + singleLinkHeight > pageHeight - margin) {
    doc.addPage();
    cursorY = margin;
  } else {
    cursorY += 15; // Extra space before sources
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(linksHeader, margin, cursorY);
  cursorY += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  for (const post of posts) {
    if (cursorY + 10 > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
    }

    const postText = `${post.title} (${post.subreddit})`;
    const textLines = doc.splitTextToSize(postText, maxWidth);
    
    doc.setTextColor(0, 0, 255); // Blue color for links
    doc.text(textLines, margin, cursorY,);
    
    const textHeight = textLines.length * 4;
    doc.link(margin, cursorY - 3, maxWidth, textHeight, { url: post.url });

    cursorY += textHeight + 2;
  }
  
  // 5. Save the PDF
  const safeFilename = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${safeFilename}.pdf`);
}
