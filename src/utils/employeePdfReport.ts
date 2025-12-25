import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ReportEmployee {
  name: string
  email: string
  mobile: string
  designation: string
  companyName: string
  departmentName: string
  hiredOn: string
  daysEmployed: number
  status: string
}

export function generateEmployeePDF(
  employees: ReportEmployee[],
  title: string,
  subtitle: string
) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(18)
  doc.setTextColor(45, 90, 67) // Primary color
  doc.text(title, 14, 20)
  
  // Subtitle
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(subtitle, 14, 27)
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 32)
  doc.text(`Total Employees: ${employees.length}`, 14, 37)
  
  // Filter only hired employees
  const hiredEmployees = employees.filter(emp => emp.status === 'Hired')
  
  // Table data with row numbers
  const tableData = hiredEmployees.map((emp, index) => [
    (index + 1).toString(),
    emp.name,
    emp.email,
    emp.mobile || '-',
    emp.designation || '-',
    emp.companyName,
    emp.departmentName,
    emp.hiredOn ? new Date(emp.hiredOn).toLocaleDateString() : '-',
    emp.daysEmployed.toString()
  ])
  
  autoTable(doc, {
    head: [['#', 'Name', 'Email', 'Mobile', 'Position', 'Company', 'Department', 'Hired On', 'Days']],
    body: tableData,
    startY: 43,
    headStyles: {
      fillColor: [45, 90, 67],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 50]
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    margin: { top: 43 },
    styles: {
      cellPadding: 3,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 8 },   // #
      1: { cellWidth: 22 },  // Name
      2: { cellWidth: 32 },  // Email
      3: { cellWidth: 18 },  // Mobile
      4: { cellWidth: 22 },  // Position
      5: { cellWidth: 22 },  // Company
      6: { cellWidth: 22 },  // Department
      7: { cellWidth: 18 },  // Hired On
      8: { cellWidth: 12 }   // Days
    }
  })
  
  // Footer
  const pageCount = doc.internal.pages.length - 1
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }
  
  return doc
}