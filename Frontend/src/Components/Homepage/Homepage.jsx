import logo1 from "../../assets/logo1.svg";
import img1 from "../../assets/blue.png";
import "./Homepage.css";

const Homepage = () => {
    return (
        <div className="homepage">
            <header className="homepage-navbar">
                <img src={logo1} className="homepage-logo" alt="App Logo" />
                <nav className="homepage-nav">
                    <ul className="homepage-nav-list">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                    </ul>
                </nav>
                <a className="homepage-login" href="/login">Login / Sign Up</a>
            </header>

            <section id="home" className="homepage-hero">
                <div className="homepage-text">
                    <h1 className="homepage-welcome"></h1>
                    <p className="homepage-description">
                        Unlock the full potential of your Excel data with our powerful and intuitive analytics tool.
                    </p>
                </div>
                <img src={img1} className="homepage-image" alt="3D visual" />
            </section>

            <section id="about" className="homepage-about">
                <div className="homepage-about-content">
                    <h2 className="homepage-about-title">About Excel Analytics</h2>
                    <p className="homepage-about-text">
                        Our platform is designed to simplify complex data analysis. Whether you're a business professional,
                        a student, or a data enthusiast, we provide the tools to transform raw Excel files into
                        beautiful, interactive visualizations and actionable AI insights.
                    </p>
                    <div className="homepage-about-stats">
                        <div className="stat-item">
                            <h3>100%</h3>
                            <p>Secure</p>
                        </div>
                        <div className="stat-item">
                            <h3>Fast</h3>
                            <p>Processing</p>
                        </div>
                        <div className="stat-item">
                            <h3>AI</h3>
                            <p>Powered</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="homepage-howto">
                <h2 className="homepage-howto-title">Steps To Upload Your File</h2>
                <ol className="homepage-howto-list">
                    <li className="homepage-howto-step">
                        <span className="homepage-step-number">1</span>
                        <h3 className="homepage-step-title">Select File</h3>
                        <p className="homepage-step-text">
                            Select the Excel file from your device.
                        </p>
                    </li>
                    <li className="homepage-howto-step">
                        <span className="homepage-step-number">2</span>
                        <h3 className="homepage-step-title">Processing</h3>
                        <p className="homepage-step-text">
                            The server processes the file and generates graphs.
                        </p>
                    </li>
                    <li className="homepage-howto-step">
                        <span className="homepage-step-number">3</span>
                        <h3 className="homepage-step-title">Download</h3>
                        <p className="homepage-step-text">
                            Download the results. Files will be safely removed post-download.
                        </p>
                    </li>
                </ol>
            </section>

            <footer className="homepage-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <img src={logo1} alt="Logo" className="footer-logo" />
                        <p className="footer-desc">
                            Transforming your complex Excel data into actionable insights through powerfull visualizations and AI.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="/login">Dashboard</a></li>
                            <li><a href="/signup">Get Started</a></li>
                        </ul>
                    </div>

                    <div className="footer-social">
                        <h4>Connect With Us</h4>
                        <div className="social-icons">
                            <span title="Facebook">FB</span>
                            <span title="Twitter">TW</span>
                            <span title="LinkedIn">LN</span>
                            <span title="Instagram">IG</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Excel Analysis Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
