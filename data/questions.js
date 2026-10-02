function make(prefix){return {title:`${prefix} English Grammar Test`,questions:Array.from({length:20},(_,i)=>[`Question ${i+1}: Complete the grammar task carefully. Use correct grammar and punctuation. (Set ${prefix})`])};}
module.exports={S01:make('S01'),N02:make('N02'),V03:make('V03'),D04:make('D04'),A05:make('A05'),A06:make('A06'),R07:make('R07'),R08:make('R08')};
