import pandas as pd
import re

# Load the Excel file
file_path = "formulas.xlsx"
df = pd.read_excel(file_path, header=None, names=["idx", "grade", "theme", "formula"])

# Function to format formulas with HTML math syntax
def format_formula(formula):
    if not isinstance(formula, str):
        return formula  # Return as is if not a string
    
    # Exponents (x^2 → x<sup>2</sup>)
    formula = re.sub(r'(\w+)\^(\w+)', r'\1<sup>\2</sup>', formula)
    
    # Multiplication (a * b → a · b)
    formula = formula.replace("*", "·")
    
    # Fractions (a / b → <span class="frac"><sup>a</sup>/<sub>b</sub></span>)
    formula = re.sub(r'(\d+)\s*/\s*(\d+)', r'<span class="frac"><sup>\1</sup>/<sub>\2</sub></span>', formula)

    return formula

# Apply formatting
df["formula"] = df["formula"].apply(format_formula)

# Group by grade
grouped = df.groupby("grade")

# Start HTML output
html_output = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Algebra Formulas</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h2 { background: #007BFF; color: white; padding: 10px; display: flex; align-items: center; }
        h2 input { margin-left: 15px; transform: scale(1.3); }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f4f4f4; }
        .frac sup { font-size: 0.8em; vertical-align: top; }
        .frac sub { font-size: 0.8em; vertical-align: bottom; }
        input[type="checkbox"] { margin-right: 10px; }
    </style>
    <script>
        function toggleGrade(grade) {
            let checkboxes = document.querySelectorAll('.grade-' + grade);
            let gradeCheckbox = document.getElementById('grade-check-' + grade);
            checkboxes.forEach(cb => cb.checked = gradeCheckbox.checked);
        }
    </script>
</head>
<body>
    <h1>Algebra Formulas by Grade</h1>
"""

# Generate tables for each grade
for grade, data in grouped:
    html_output += f'<h2>Grade {grade} <input type="checkbox" id="grade-check-{grade}" onclick="toggleGrade({grade})"></h2>\n'
    html_output += "<table>\n<tr><th>#</th><th>Theme</th><th>Formula</th><th>Check</th></tr>\n"
    
    for _, row in data.iterrows():
        checkbox = f'<input type="checkbox" class="formula-check-{row["idx"]} grade-{grade}">'
        html_output += f"<tr><td>{row['idx']}</td><td>{row['theme']}</td><td>{row['formula']}</td><td>{checkbox}</td></tr>\n"

    html_output += "</table>\n"

# Close HTML
html_output += """
</body>
</html>
"""

# Save to an HTML file
with open("output.html", "w", encoding="utf-8") as f:
    f.write(html_output)

print("HTML file generated: output.html")