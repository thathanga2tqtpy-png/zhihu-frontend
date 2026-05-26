export function Header() {
  return (
    <header className="border-b py-6 mb-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Zhihu Reads</h1>
        <nav className="flex gap-4 items-center">
          <a href="/" className="text-muted-foreground hover:text-foreground">Trang chủ</a>
          <a href="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">Đăng nhập</a>
        </nav>
      </div>
    </header>
  );
}
