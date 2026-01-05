import React, { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';
import { MdOutlineDownload, MdOutlinePrint } from 'react-icons/md';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CTableProps<T> {
  data: T[];
  headers?: { [key: string]: string }; // Optional headers prop for custom column names
  onEdit?: (item: T) => void; // Optional onEdit prop
  onDelete?: (id: number) => void; // Optional onDelete prop
  className?: string;
}

interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

const CTable = <T extends { [key: string]: unknown; id?: number }>({
  data,
  headers = {}, // Default to an empty object if no headers are provided
  // onEdit = () => {}, // Default no-op function for onEdit
  // onDelete = () => {}, // Default no-op function for onDelete
  className = '',
}: CTableProps<T>) => {
  const [sortedData, setSortedData] = useState<T[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(7);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'ascending' });
  const printRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setSortedData(data || []);
  }, [data]);

  const handlePrint = () => {
    if (sortedData.length === 0) {
      alert('Aucune donnée à imprimer');
      return;
    }

    try {
      const doc = new jsPDF();

      const tableData = sortedData.map(row =>
        Object.keys(sortedData[0]).map(key => {
          const value = row[key];
          if (value === null || value === undefined) return '';
          if (Array.isArray(value)) return value.join(', ');
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        })
      );

      const tableHeaders = Object.keys(sortedData[0]).map(key => headers[key] || key);

      // Utiliser autoTable comme fonction
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] },
      });

      doc.save('rapport.pdf');
    } catch (error) {
      console.error('Erreur lors de l\'impression :', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Erreur lors de la génération du PDF: ${errorMessage}`);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }

    const sorted = [...sortedData].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      const aStr = String(aValue ?? '');
      const bStr = String(bValue ?? '');

      if (aStr < bStr) {
        return direction === 'descending' ? -1 : 1;
      }
      if (aStr > bStr) {
        return direction === 'descending' ? 1 : -1;
      }
      return 0;
    });

    setSortedData(sorted);
    setSortConfig({ key, direction });
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const filteredData = sortedData.filter((row) =>
    Object.values(row).some((s) => ("" + s).toLowerCase().includes(filter.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentPage(Number(event.currentTarget.id));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDownload = (format: 'excel' | 'json' | 'csv' | 'pdf') => {
    if (sortedData.length === 0) {
      alert('Aucune donnée à télécharger');
      setIsDropdownOpen(false);
      return;
    }

    try {
      if (format === 'excel') {
        // Préparer les données pour Excel
        const worksheetData = sortedData.map(row => {
          const rowData: { [key: string]: unknown } = {};
          Object.keys(sortedData[0]).forEach(key => {
            const value = row[key];
            if (value === null || value === undefined) {
              rowData[headers[key] || key] = '';
            } else if (Array.isArray(value)) {
              rowData[headers[key] || key] = value.join(', ');
            } else if (typeof value === 'object') {
              rowData[headers[key] || key] = JSON.stringify(value);
            } else {
              rowData[headers[key] || key] = value;
            }
          });
          return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
        XLSX.writeFile(workbook, 'rapport.xlsx');
      } else if (format === 'csv') {
        // Préparer les données pour CSV
        const headersRow = Object.keys(sortedData[0]).map(key => headers[key] || key).join(',');
        const csvRows = sortedData.map(row =>
          Object.keys(sortedData[0]).map(key => {
            const value = row[key];
            if (value === null || value === undefined) return '';
            if (Array.isArray(value)) return `"${value.join(', ')}"`;
            if (typeof value === 'object') return `"${JSON.stringify(value)}"`;
            const stringValue = String(value);
            // Échapper les guillemets et les virgules
            return stringValue.includes(',') || stringValue.includes('"')
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue;
          }).join(',')
        );
        const csvContent = [headersRow, ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'rapport.csv');
      } else if (format === 'json') {
        const jsonContent = JSON.stringify(sortedData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        saveAs(blob, 'rapport.json');
      } else if (format === 'pdf') {
        const doc = new jsPDF();

        const tableData = sortedData.map(row =>
          Object.keys(sortedData[0]).map(key => {
            const value = row[key];
            if (value === null || value === undefined) return '';
            if (Array.isArray(value)) return value.join(', ');
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);
          })
        );

        const tableHeaders = Object.keys(sortedData[0]).map(key => headers[key] || key);

        // Utiliser autoTable comme fonction
        autoTable(doc, {
          head: [tableHeaders],
          body: tableData,
          startY: 20,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [66, 139, 202] },
        });

        doc.save('rapport.pdf');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement :', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Erreur lors du téléchargement: ${errorMessage}`);
    } finally {
      setIsDropdownOpen(false);
    }
  };

  // Helper function to render cell data
  const renderCellData = (value: unknown) => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5">
          {value.map((item, idx) => (
            <li key={idx}>{String(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === 'object' && value !== null) {
      // Handle objects if necessary, e.g., render specific properties
      return JSON.stringify(value); // Just for debugging, replace with actual rendering logic
    } else {
      return String(value ?? '');
    }
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="flex flex-col md:flex-row gap-3 justify-end p-2 m-2">
        <div className="relative">
          <button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <MdOutlinePrint />
            {/* <span className='ml-2'> PDF </span> */}
          </button></div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <MdOutlineDownload />
            {/* <span className="ml-2">Télécharger</span> */}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button onClick={() => handleDownload('excel')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Excel</button>
                <button onClick={() => handleDownload('json')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">JSON</button>
                <button onClick={() => handleDownload('csv')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">CSV</button>
                <button onClick={() => handleDownload('pdf')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">PDF</button>
              </div>
            </div>
          )}
        </div>
        <input
          type="text"
          onChange={handleFilter}
          placeholder="Filtrer..."
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div ref={printRef} className="overflow-x-auto">
        {sortedData.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(sortedData[0]).map((key, index) => (
                  <th key={index} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort(key)} className="text-blue-500 hover:text-blue-800 text-base">
                      {headers[key] || key} {/* Use custom header name if provided, else fallback to key */}
                    </button>
                  </th>
                ))}
                {/* <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.entries(row).map(([key, value], cellIndex) => (
                    <td key={cellIndex} className="px-4 py-4 whitespace-nowrap">
                      {key === 'images' && Array.isArray(value) && value.length > 0 ? (
                        <Link to={`/show-product/${row.id}`}>
                          <img src={value[0]} alt="" className="h-10 w-10 rounded-full" />
                        </Link>
                      ) : (
                        renderCellData(value)
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {/* <button onClick={() => onEdit?.(row)} className="text-yellow-500 text-lg hover:text-yellow-700 font-bold py-1 px-2 rounded mx-1">
                      <PiPencil />
                    </button> */}
                    {/* <button onClick={() => onDelete?.(row.id!)} className="text-red-500 text-lg hover:text-red-700 font-bold py-1 px-2 rounded mx-1">
                      <BiTrash />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className='flex m-4 font-semibold text-center text-red-500'>Pas de données disponibles</div>
        )}

      </div>
      <div className="flex justify-between items-center p-2">
        <p className="text-xl font-semibold text-gray-500">Page : {currentPage}</p>
        <div className="flex gap-2">
          {Array.from(Array(Math.ceil(filteredData.length / itemsPerPage)), (_e, i) => (
            <button key={i} id={(i + 1).toString()} onClick={handlePageChange} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${currentPage === i + 1 ? 'bg-blue-700' : ''}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CTable;
