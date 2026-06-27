import io
import csv
import json
import yaml
import pypdf
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Union

class BaseParser(ABC):
    @abstractmethod
    def parse(self, content: bytes) -> Union[List[Dict[str, Any]], Dict[str, Any], str]:
        pass

class CSVParser(BaseParser):
    def parse(self, content: bytes) -> List[Dict[str, Any]]:
        text = content.decode('utf-8')
        reader = csv.DictReader(io.StringIO(text))
        return list(reader)

class JSONParser(BaseParser):
    def parse(self, content: bytes) -> Union[List[Dict[str, Any]], Dict[str, Any]]:
        return json.loads(content.decode('utf-8'))

class JSONLParser(BaseParser):
    def parse(self, content: bytes) -> List[Dict[str, Any]]:
        text = content.decode('utf-8')
        records = []
        for idx, line in enumerate(text.splitlines()):
            line = line.strip()
            if not line:
                continue
            try:
                records.append(json.loads(line))
            except json.JSONDecodeError as e:
                # We log or handle malformed lines inside ValidationService
                # But here we can raise or record it as a dict with error for validator to catch
                records.append({"_corrupted_row_idx": idx, "_decode_error": str(e), "line": line})
        return records

class DocxParser(BaseParser):
    def parse(self, content: bytes) -> str:
        import zipfile
        import xml.etree.ElementTree as ET
        file_like = io.BytesIO(content)
        try:
            with zipfile.ZipFile(file_like) as docx:
                xml_content = docx.read('word/document.xml')
                root = ET.fromstring(xml_content)
                
                paragraphs = []
                for para in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                    texts = []
                    for run in para.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}r'):
                        for text in run.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                            texts.append(text.text)
                    paragraphs.append(''.join(texts))
                return '\n'.join(paragraphs)
        except Exception as e:
            raise ValueError(f"Failed to parse DOCX: {e}")

class PDFParser(BaseParser):
    def parse(self, content: bytes) -> str:
        file_like = io.BytesIO(content)
        try:
            reader = pypdf.PdfReader(file_like)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
        except Exception as e:
            raise ValueError(f"Failed to parse PDF: {e}")

class YAMLParser(BaseParser):
    def parse(self, content: bytes) -> Union[List[Any], Dict[str, Any]]:
        try:
            return yaml.safe_load(content.decode('utf-8'))
        except Exception as e:
            raise ValueError(f"Failed to parse YAML: {e}")

class ParserFactory:
    @staticmethod
    def get_parser(filename: str) -> BaseParser:
        filename_lower = filename.lower()
        if filename_lower.endswith('.csv'):
            return CSVParser()
        elif filename_lower.endswith('.json'):
            return JSONParser()
        elif filename_lower.endswith('.jsonl') or filename_lower.endswith('.jsonl.gz'):
            # If it is gzipped JSONL, the extraction service will decompress it first, 
            # so the parser will receive the raw uncompressed JSONL bytes.
            return JSONLParser()
        elif filename_lower.endswith('.docx'):
            return DocxParser()
        elif filename_lower.endswith('.pdf'):
            return PDFParser()
        elif filename_lower.endswith('.yaml') or filename_lower.endswith('.yml'):
            return YAMLParser()
        raise ValueError(f"Unsupported file format: {filename}")
