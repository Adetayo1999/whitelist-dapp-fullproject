import Footer from './footer';
import Header from './header';

type LayoutProps = {
  children: React.ReactChild;
};

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <div className="min-h-[80vh]">{children}</div>
      <Footer />
    </>
  );
}

export default Layout;
