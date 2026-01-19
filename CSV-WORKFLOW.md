# CSV Upload Workflow - Super Simple!

## How It Works

Your site reads CSV files directly from the `/data` folder in your GitHub repo. 

**To update your site:**
1. Edit the CSV files (in Excel, Google Sheets, or any spreadsheet app)
2. Upload to GitHub `/data` folder
3. Done! Site updates automatically

## Current CSV Files

Your site uses these 4 CSV files in the `/data` folder:

- `publications-template.csv` - Your publications
- `projects-template.csv` - Your projects
- `speaking-template.csv` - Speaking engagements
- `media-template.csv` - Media appearances

## Two Ways to Update

### **Option 1: Edit on GitHub (Easiest)**

1. Go to your GitHub repo
2. Navigate to `/data` folder
3. Click on the CSV file (e.g., `publications-template.csv`)
4. Click the pencil icon (✏️ Edit)
5. Add/edit rows
6. Click **"Commit changes"**
7. Wait 1-2 minutes for Netlify to rebuild
8. Refresh your site!

### **Option 2: Edit Locally (More Control)**

1. **Download** the CSV file from GitHub
2. **Open in Excel/Google Sheets/Numbers**
3. **Add/edit/delete** rows
4. **Save as CSV**
5. **Upload to GitHub:**
   - Go to GitHub → `/data` folder
   - Click **"Add file"** → **"Upload files"**
   - Drag your CSV file
   - Click **"Commit changes"**
6. Wait 1-2 minutes for rebuild
7. Site is updated!

## Using Excel

### To Edit:
1. Download CSV from GitHub
2. Open in Excel
3. Make your changes
4. **Save As** → Choose **"CSV UTF-8 (Comma delimited)"**
5. Upload back to GitHub

⚠️ **Important:** Always save as CSV, not .xlsx!

## Using Google Sheets

### To Edit:
1. Download CSV from GitHub
2. Open Google Sheets
3. **File → Import** → Upload the CSV
4. Make your changes
5. **File → Download → Comma Separated Values (.csv)**
6. Upload to GitHub

## Column Headers (Don't Change These!)

### Publications:
`Title, Authors, Year, Type, Venue, Volume, Link, Award`

### Projects:
`Title, Description, Role, StartDate, EndDate, Status, Funding, Funder, Partners, Link`

### Speaking:
`Title, Type, Date, Venue, Location, Copresenters, Link`

### Media:
`Title, Type, Source, Date, Author, Link, Award`

## Adding New Content

Just add a new row at the bottom with all the columns filled in!

**Example - Adding a new publication:**
1. Open `publications-template.csv`
2. Add new row:
   ```
   "My New Article","Smith, J. & Audrain, R.L.",2026,"Journal Article","Education Today","5(2)",https://link.com,
   ```
3. Save and upload
4. Done!

## Tips

✅ **Do:**
- Keep column headers exactly as they are
- Use quotes around text with commas (e.g., "Title: A Study")
- Leave cells empty if no data (just use commas: `,,`)
- Save as CSV format

❌ **Don't:**
- Change column header names
- Save as .xlsx or other formats
- Add extra columns without updating the code
- Use line breaks inside cells

## Monthly Update Workflow

**Example: End of month update**

1. Open each CSV in Excel/Sheets
2. Add any new publications/projects/talks/media
3. Save all as CSV
4. Upload all 4 files to GitHub `/data` folder
5. Commit with message: "Update January 2026"
6. Wait for rebuild
7. Check site to confirm updates

**That's it!** Takes 5-10 minutes per month.

## Troubleshooting

**Content not showing?**
- Make sure file is in `/data` folder
- Check file name is exactly correct (case-sensitive)
- Look for CSV formatting errors (unmatched quotes)
- Hard refresh your browser (Ctrl+Shift+R)

**Weird formatting?**
- Make sure you saved as CSV, not Excel
- Check for quotes around text with commas
- Ensure no line breaks inside cells

**Changes not appearing?**
- Check Netlify deploy logs (in Netlify dashboard)
- Wait 2-3 minutes after uploading
- Clear browser cache

## Need to Edit Multiple Files?

You can upload all 4 CSV files at once:
1. Edit all files locally
2. Go to GitHub → `/data` folder
3. Click **"Upload files"**
4. Drag all 4 CSVs
5. Commit once
6. All files update together!

---

## Example: Adding Your First New Publication

Let's say you just published a new article in March 2026:

1. Go to GitHub → `/data/publications-template.csv`
2. Click Edit (✏️)
3. Add new line at bottom:
   ```csv
   "Breaking New Ground in Education","Audrain, R.L., & Johnson, M.",2026,"Journal Article","Educational Research Quarterly","15(1), 45-67",https://doi.org/example,
   ```
4. Commit changes
5. Wait 1-2 minutes
6. Check your Publications page - it's there!

**That's all you need to know!** 🎉

No Google Sheets setup, no API keys, no complex configuration. Just edit CSV files and upload to GitHub!
