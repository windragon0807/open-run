interface CategorySelectorProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export default function CategorySelector({ selectedCategory, setSelectedCategory }: CategorySelectorProps) {
  const categories = ['전체', 'head', 'eye', 'ear', 'body']

  return (
    <div className='h-[40px] flex items-center px-5 overflow-x-auto whitespace-nowrap'>
      {categories.map((category) => (
        <button
          key={category}
          className={`mr-4 px-3 py-1 rounded ${
            selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-200'
          }`}
          onClick={() => setSelectedCategory(category)}>
          {category}
        </button>
      ))}
    </div>
  )
}
