<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex Puliatti - Portfolio</title>
    <style>
        @font-face {
            font-family: 'Helvetica Neue';
            src: url('path-to-helvetica-neue-regular.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
        }
        body, html {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #000000;
            color: #ffffff;
            font-weight: normal;
            line-height: 1.6;
        }
        .container {
            padding: 5vw;
            box-sizing: border-box;
            max-width: 1200px;
            margin: 0 auto;
        }
        .nav-link {
            display: inline-block;
            margin-bottom: 20px;
            font-size: 16px;
            color: #808080;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        .nav-link:hover {
            color: #ffffff;
        }
        .content-wrapper {
            display: flex;
            flex-direction: column;
        }
        .left-column, .right-column {
            width: 100%;
        }
        h1 {
            color: #ffffff;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 5px;
            font-weight: normal;
        }
        h2 {
            color: #ffffff;
            font-size: 20px;
            margin-bottom: 10px;
            font-weight: normal;
        }
        p {
            color: #808080;
            font-size: 16px;
            margin-top: 0;
            margin-bottom: 15px; /* Added margin-bottom to create space between paragraphs */
        }
        .birth-info {
            margin-top: 0;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 30px;
        }
        a {
            color: #808080;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        a:hover {
            color: #ffffff;
        }
        @media (min-width: 768px) {
            .content-wrapper {
                flex-direction: row;
            }
            .left-column, .right-column {
                width: 50%;
            }
            .left-column {
                padding-right: 20px;
            }
            .right-column {
                padding-left: 20px;
            }
        }
        /* Hide Tumblr banner and related elements */
        .tmblr-iframe,
        .tmblr-iframe--controls-phone-container,
        .tmblr-iframe--app-cta-button,
        .tumblr-banner,
        #tumblr_controls,
        .tumblr_controls,
        .tmblr-iframe--desktop-logged-in-controls.iframe-controls--desktop,
        .tmblr-iframe--controls-phone-container.tmblr-iframe--loaded.iframe-controls--phone-mobile,
        .pill-button_label,
        .toast-wrapper,
        .toast-wrapper--open,
        .toast-wrapper--transition {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
        /* Ensure the body takes full height and isn't affected by hidden elements */
        body {
            min-height: 100vh;
            padding-top: 0 !important;
            margin-top: 0 !important;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="https://www.alexpuliatti.com" class="nav-link">← Back to main website</a>

        <div class="content-wrapper">
            <div class="left-column">
                <div class="section">
                    <h1>Alex Puliatti</h1>
                </div>
            </div>
            <div class="right-column">
                <div class="section">

                </div>

                <div class="section">
                    <h2>Contact</h2>
                    <p>
                        <a href="mailto:a@puliatti.com">Email</a>, 
                        <a href="https://www.instagram.com/alexpuliatti" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </p>
                </div>

                <div class="section">
                    <h2>Selected Clients & Collaborators</h2>
                    <p>Diesel, Marni, Jil Sander, Maison Margiela, A-COLD-WALL*, UMG, WMG, Rkomi, Irama, The Martinez Brothers, Black Coffee, Peggy Gou, Saint Levant, A New Plane</p>
                </div>

                <div class="section">
                    <h2>Selected Features</h2>
                    <p>
                        <a href="https://www.anothermag.com/art-photography/15858/art-in-the-age-of-ai-holly-herndon-mat-dryhurst-with-hans-ulrich-obrist" target="_blank" rel="noopener noreferrer">AnOther</a>, 
                        Chaos Magazine, 
                        <a href="https://notion.online/talia-goddess-one-time-launch-party/" target="_blank" rel="noopener noreferrer">Notion Magazine</a>, 
                        <a href="https://www.instagram.com/p/C9-MODftNGC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" rel="noopener noreferrer">Selin Magazine</a>, 
                        GQ Italia
                    </p>
                </div>

                <div class="section">
                    <h2>Public Talks</h2>
                    <p>King's College London (2024)<br>
                    <a href="https://youtu.be/XhVnsLeFkwI?si=oeF3TowStFfc26ZD" target="_blank" rel="noopener noreferrer">Royal College of Art (2024)</a><br>
                    <a href="https://open.spotify.com/episode/27INUPBzLEhaixbscXX9hl?si=eeef06ee551d4487" target="_blank" rel="noopener noreferrer">APEX at Reference.Points / 180 Studios (2024)</a></p>
                </div>

                <div class="section">
                    <h2>Awards</h2>
                    <p>
                        <a href="https://www.photographyfoundationawards.com/2023-winners" target="_blank" rel="noopener noreferrer">Leica Photography Foundation Award</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>