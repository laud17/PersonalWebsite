// CSV Data Loader - Reads CSV files directly from your GitHub repo
// Just update the CSV files in /data folder and push to GitHub!

class CSVDataLoader {
    constructor() {
        this.baseUrl = '/'; // Changed from '/data/' to root
    }

    // Parse CSV text into array of objects
    parseCSV(text) {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        
        return lines.slice(1).map(line => {
            const values = this.parseCSVLine(line);
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
            });
            return obj;
        });
    }

    // Handle CSV parsing with quotes
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        return values;
    }

    // Fetch and parse a CSV file
    async fetchCSV(filename) {
        try {
            console.log('Attempting to fetch:', this.baseUrl + filename);
            const response = await fetch(this.baseUrl + filename);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            console.log('Successfully fetched:', filename);
            return this.parseCSV(text);
        } catch (error) {
            console.error(`Error fetching ${filename}:`, error);
            return [];
        }
    }

    // Load and display publications
    async loadPublications() {
        const data = await this.fetchCSV('publications-template.csv');
        const container = document.querySelector('.publications-list');
        if (!container) return;

        // Group by type
        const grouped = {
            'Book': [],
            'Peer-Reviewed Journal Article': [],
            'Peer-Reviewed Book Chapter': [],
            'Professional Journal Article': [],
            'Research Report': [],
            'Public Scholarship': []
        };

        data.forEach(pub => {
            // Map old types to new categories
            if (pub.Type === 'Journal Article') {
                grouped['Peer-Reviewed Journal Article'].push(pub);
            } else if (pub.Type === 'Book Chapter') {
                grouped['Peer-Reviewed Book Chapter'].push(pub);
            } else if (pub.Type === 'Professional Article') {
                grouped['Professional Journal Article'].push(pub);
            } else if (pub.Type === 'Public Scholarship') {
                grouped['Public Scholarship'].push(pub);
            } else if (grouped[pub.Type]) {
                grouped[pub.Type].push(pub);
            }
        });

        let html = '';

        // Books
        if (grouped['Book'].length > 0) {
            html += `
                <div class="pub-category">
                    <h2 class="pub-category-title">Books</h2>
                    <div class="publications-list-inner">
                        ${grouped['Book'].map(pub => `
                            <article class="publication-item">
                                <p class="pub-citation">${pub.Authors} (${pub.Year}). <em>${pub.Title}</em>. ${pub.Venue}.</p>
                                ${pub.Award ? `<p class="pub-award">${pub.Award}</p>` : ''}
                                ${pub.Link ? `<a href="${pub.Link}" class="pub-link" target="_blank">View Book →</a>` : ''}
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Peer-Reviewed Journal Articles
        if (grouped['Peer-Reviewed Journal Article'].length > 0) {
            html += `
                <div class="pub-category">
                    <h2 class="pub-category-title">Peer-Reviewed Journal Articles</h2>
                    <div class="publications-list-inner">
                        ${grouped['Peer-Reviewed Journal Article'].map(pub => `
                            <article class="publication-item">
                                <p class="pub-citation">${pub.Authors} (${pub.Year}). ${pub.Title}. <em>${pub.Venue}</em>${pub.Volume ? ', ' + pub.Volume : ''}.</p>
                                ${pub.Award ? `<p class="pub-award">${pub.Award}</p>` : ''}
                                ${pub.Link ? `<a href="${pub.Link}" class="pub-link" target="_blank">Read Article →</a>` : ''}
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Peer-Reviewed Book Chapters
        if (grouped['Peer-Reviewed Book Chapter'].length > 0) {
            html += `
                <div class="pub-category">
                    <h2 class="pub-category-title">Peer-Reviewed Book Chapters</h2>
                    <div class="publications-list-inner">
                        ${grouped['Peer-Reviewed Book Chapter'].map(pub => `
                            <article class="publication-item">
                                <p class="pub-citation">${pub.Authors} (${pub.Year}). ${pub.Title}. In <em>${pub.Venue}</em>.</p>
                                ${pub.Award ? `<p class="pub-award">${pub.Award}</p>` : ''}
                                ${pub.Link ? `<a href="${pub.Link}" class="pub-link" target="_blank">Read Chapter →</a>` : ''}
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Professional Journal Articles
        if (grouped['Professional Journal Article'].length > 0) {
            html += `
                <div class="pub-category">
                    <h2 class="pub-category-title">Professional Journal Articles</h2>
                    <div class="publications-list-inner">
                        ${grouped['Professional Journal Article'].map(pub => `
                            <article class="publication-item">
                                <p class="pub-citation">${pub.Authors} (${pub.Year}). ${pub.Title}. <em>${pub.Venue}</em>${pub.Volume ? ', ' + pub.Volume : ''}.</p>
                                ${pub.Link ? `<a href="${pub.Link}" class="pub-link" target="_blank">Read Article →</a>` : ''}
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Research Reports
        if (grouped['Research Report'].length > 0) {
            html += `
                <div class="pub-category">
                    <h2 class="pub-category-title">Research Reports</h2>
                    <div class="publications-list-inner">
                        ${grouped['Research Report'].map(pub => `
                            <article class="publication-item">
                                <p class="pub-citation">${pub.Authors} (${pub.Year}). ${pub.Title}. ${pub.Venue}.</p>
                                ${pub.Link ? `<a href="${pub.Link}" class="pub-link" target="_blank">Read Report →</a>` : ''}
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Public Scholarship
        if (grouped['Public Scholarship'].length > 0) {
            html += `
                <div class="pub-category">
                    <h2 class="pub-category-title">Public Scholarship</h2>
                    <div class="publications-list-inner">
                        ${grouped['Public Scholarship'].map(pub => `
                            <article class="publication-item">
                                <p class="pub-citation">${pub.Authors} (${pub.Year}). ${pub.Title}. <em>${pub.Venue}</em>.</p>
                                ${pub.Link ? `<a href="${pub.Link}" class="pub-link" target="_blank">Read Article →</a>` : ''}
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // Load and display projects
    async loadProjects() {
        const data = await this.fetchCSV('projects-template.csv');
        const container = document.querySelector('.projects-grid');
        if (!container) return;

        container.innerHTML = data.map(project => `
            <article class="project-card">
                <div class="project-header">
                    <span class="project-status ${project.Status?.toLowerCase()}">${project.Status}</span>
                    <span class="project-date">${project.StartDate}${project.EndDate ? ' - ' + project.EndDate : ' - Present'}</span>
                </div>
                <h3 class="project-title">${project.Title}</h3>
                <p class="project-role">${project.Role}</p>
                <p class="project-description">${project.Description}</p>
                ${project.Funding ? `<p class="project-funding">💰 ${project.Funding}</p>` : ''}
                ${project.Funder ? `<p class="project-funder">Funded by: ${project.Funder}</p>` : ''}
                ${project.Partners ? `<p class="project-partners">Partners: ${project.Partners}</p>` : ''}
                ${project.Link ? `<a href="${project.Link}" class="project-link" target="_blank">Learn More →</a>` : ''}
            </article>
        `).join('');
    }

    // Load and display speaking engagements
    async loadSpeaking() {
        const data = await this.fetchCSV('speaking-template.csv');
        const container = document.querySelector('.presentations-list');
        if (!container) return;

        // Group by type
        const keynotes = data.filter(t => t.Type === 'Keynote' || t.Type === 'Grand Session');
        const others = data.filter(t => t.Type !== 'Keynote' && t.Type !== 'Grand Session');

        let html = '';

        if (keynotes.length > 0) {
            html += `
                <div class="speaking-category">
                    <h2 class="speaking-category-title">Keynote Presentations</h2>
                    <div class="presentations-list-inner">
                        ${keynotes.map(talk => `
                            <article class="presentation-item">
                                <p class="presentation-date">${talk.Date}</p>
                                <h3 class="presentation-title">${talk.Title}</h3>
                                <p class="presentation-venue">${talk.Venue}, ${talk.Location}</p>
                                ${talk.Copresenters ? `<p class="presentation-coauthors">With ${talk.Copresenters}</p>` : ''}
                                <span class="presentation-badge">${talk.Type}</span>
                                ${talk.Link ? `<br><a href="${talk.Link}" class="pub-link" target="_blank">Watch Recording →</a>` : ''}
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (others.length > 0) {
            html += `
                <div class="speaking-category">
                    <h2 class="speaking-category-title">Recent Invited Talks & Webinars</h2>
                    <div class="presentations-list-inner">
                        ${others.map(talk => `
                            <article class="presentation-item">
                                <p class="presentation-date">${talk.Date}</p>
                                <h3 class="presentation-title">${talk.Title}</h3>
                                <p class="presentation-venue">${talk.Venue}, ${talk.Location}</p>
                                ${talk.Copresenters ? `<p class="presentation-coauthors">With ${talk.Copresenters}</p>` : ''}
                                ${talk.Link ? `<a href="${talk.Link}" class="pub-link" target="_blank">Watch Recording →</a>` : ''}
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // Load and display media appearances
    async loadMedia() {
        const data = await this.fetchCSV('media-template.csv');
        const container = document.querySelector('.media-grid');
        if (!container) return;

        container.innerHTML = data.map(media => `
            <article class="media-card">
                <div class="media-type">${media.Type}</div>
                <h3 class="media-title">${media.Title}</h3>
                <p class="media-source">${media.Source}, ${media.Date}</p>
                ${media.Author ? `<p class="media-author">${media.Author}</p>` : ''}
                ${media.Award ? `<p class="media-award">${media.Award}</p>` : ''}
                ${media.Link ? `<a href="${media.Link}" class="media-link" target="_blank">View →</a>` : ''}
            </article>
        `).join('');
    }

    // Initialize based on current page
    init() {
        const path = window.location.pathname;
        
        if (path.includes('publications')) {
            this.loadPublications();
        } else if (path.includes('projects')) {
            this.loadProjects();
        } else if (path.includes('speaking')) {
            this.loadSpeaking();
        } else if (path.includes('media')) {
            this.loadMedia();
        }
    }
}

// Wait for DOM to load, then initialize
document.addEventListener('DOMContentLoaded', () => {
    const loader = new CSVDataLoader();
    loader.init();
});
