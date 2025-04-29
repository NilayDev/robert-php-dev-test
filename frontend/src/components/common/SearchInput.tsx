import React from 'react';

import { ISearchProps } from '../../interface/table';
import AllImages from '../../constants/image';

const SearchInput: React.FC<ISearchProps> = ({
    value,
    onChange,
    placeholder = "Search"
}) => (
    <div className="relative">
        <input
            type="text"
            className="w-full h-10 pl-4 pr-10 text-black/50 rounded-md border border-black/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
        <AllImages.search className="absolute right-3 top-2.5 h-5 w-5 text-black/70" />
    </div>
);

export default SearchInput;