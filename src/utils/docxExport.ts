import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, PageBreak } from 'docx';
import { REPORT_PAGES, REPORT_METADATA } from '../data/reportPagesData';

export async function exportReportToWord(): Promise<void> {
  const children: Paragraph[] = [];

  // Title / Cover Page Section
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1200, after: 300 },
      children: [
        new TextRun({
          text: REPORT_METADATA.title,
          bold: true,
          size: 36,
          color: '0D9488', // Teal-600
          font: 'Calibri'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: REPORT_METADATA.subtitle,
          italics: true,
          size: 24,
          color: '334155',
          font: 'Calibri'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Institution: ${REPORT_METADATA.institution}`,
          bold: true,
          size: 20,
          color: '475569',
          font: 'Calibri'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Prepared By: ${REPORT_METADATA.author}`,
          size: 20,
          color: '475569',
          font: 'Calibri'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
      children: [
        new TextRun({
          text: `${REPORT_METADATA.date} | Version ${REPORT_METADATA.version}`,
          size: 18,
          color: '64748B',
          font: 'Calibri'
        })
      ]
    }),
    new Paragraph({
      children: [new PageBreak()]
    })
  );

  // Iterate over all 50 pages and append structured paragraphs
  REPORT_PAGES.forEach((page) => {
    // Page Header / Chapter
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        children: [
          new TextRun({
            text: `PAGE ${page.pageNumber} | CHAPTER ${page.chapterNumber}: ${page.chapter.toUpperCase()}`,
            bold: true,
            size: 20,
            color: '0D9488',
            font: 'Calibri'
          })
        ]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: page.title,
            bold: true,
            size: 28,
            color: '0F172A',
            font: 'Calibri'
          })
        ]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `Category: ${page.category}`,
            italics: true,
            bold: true,
            size: 18,
            color: '0284C7',
            font: 'Calibri'
          })
        ]
      }),
      new Paragraph({
        spacing: { after: 250 },
        children: [
          new TextRun({
            text: `Executive Summary: ${page.summary}`,
            bold: true,
            size: 20,
            color: '334155',
            font: 'Calibri'
          })
        ]
      })
    );

    // Body content paragraphs
    page.content.forEach((para) => {
      children.push(
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({
              text: para,
              size: 20,
              color: '1E293B',
              font: 'Calibri'
            })
          ]
        })
      );
    });

    // Code snippet if present
    if (page.codeSnippet) {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: `Code Listing (${page.codeSnippet.language.toUpperCase()}): ${page.codeSnippet.caption}`,
              bold: true,
              size: 18,
              color: '475569',
              font: 'Calibri'
            })
          ]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: page.codeSnippet.code,
              font: 'Consolas',
              size: 18,
              color: '0F172A'
            })
          ]
        })
      );
    }

    // Key notes
    if (page.keyNotes.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: 'Key Architectural & Implementation Notes:',
              bold: true,
              size: 19,
              color: '0F172A',
              font: 'Calibri'
            })
          ]
        })
      );

      page.keyNotes.forEach((note) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: note,
                size: 18,
                color: '334155',
                font: 'Calibri'
              })
            ]
          })
        );
      });
    }

    // References
    if (page.references.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 150, after: 80 },
          children: [
            new TextRun({
              text: 'Authoritative Citations & References:',
              italics: true,
              size: 17,
              color: '64748B',
              font: 'Calibri'
            })
          ]
        })
      );

      page.references.forEach((ref) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: ref,
                italics: true,
                size: 17,
                color: '64748B',
                font: 'Calibri'
              })
            ]
          })
        );
      });
    }

    // Insert page break between report pages (except after page 50)
    if (page.pageNumber < REPORT_PAGES.length) {
      children.push(
        new Paragraph({
          children: [new PageBreak()]
        })
      );
    }
  });

  const doc = new Document({
    creator: REPORT_METADATA.author,
    title: REPORT_METADATA.title,
    description: REPORT_METADATA.subtitle,
    sections: [
      {
        properties: {},
        children: children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'MediPulse_Hospital_Management_System_50_Page_Report.docx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
