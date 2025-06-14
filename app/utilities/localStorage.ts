export const saveToLocalStorage = (key:string, value:string) => {
    
if (typeof window !== 'undefined') 
    localStorage.setItem(key, value);
};

export const getFromLocalStorage = (key:string) => {
    let data : string | null = null;
    if (typeof window !== 'undefined') 
         data = localStorage.getItem(key);
    return data ? data : null;
};

export const removeFromLocalStorage = (key:string) => {
    if (typeof window !== 'undefined') 
        localStorage.removeItem(key);
};
