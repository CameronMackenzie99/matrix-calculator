import { useEffect, useState } from 'react';

function NotCompatible({ canMultiply }: { canMultiply: boolean }) {
  if (!canMultiply) {
    return <div>Error: matrices not multipliable!</div>;
  }
  return <div></div>;
}

const getRowsClassName = (matrix: Matrix) => {
  if (matrix.length > 0) {
    return `grid-rows-${matrix.length}`;
  }
};
const getColsClassName = (matrix: Matrix) => {
  if (matrix.length > 0) {
    return `grid-cols-${matrix[0].length}`;
  }
};

type Matrix = number[][];

function App() {
  const [A, setA] = useState<number>(0);
  const [B, setB] = useState<number>(0);
  const [C, setC] = useState<number>(0);
  const [D, setD] = useState<number>(0);
  const [canMultiply, setCanMultiply] = useState<boolean>(false);
  const [matrix1, setMatrix1] = useState<Matrix>([[0]]);
  const [matrix2, setMatrix2] = useState<Matrix>([[0]]);

  const CheckMatrixShapes = (Matrix1Columns: number, Matrix2Rows: number) => {
    // console.log(Matrix1Columns, Matrix2Rows)
    if (Matrix1Columns === Matrix2Rows) {
      setCanMultiply(true);
    } else {
      setCanMultiply(false);
    }
  };

  const generateMatrixArray = (rows: number, columns: number, mapper: any) => {
    return Array(rows)
      .fill(undefined)
      .map(() => Array(columns).fill(undefined).map(mapper)) as Matrix;
  };

  const handleChange = (
    matrix: Matrix,
    x: number,
    y: number,
    value: number
  ) => {
    const matrixStateMap: {
      [key: string]: React.Dispatch<React.SetStateAction<Matrix>>;
    } = {
      matrix1: setMatrix1,
      matrix2: setMatrix2,
    };

    let newMatrix = [...matrix];
    newMatrix[y][x] = value;
    console.log(newMatrix, 'newmatrix');
    const stateChanger = matrixStateMap[matrix.constructor.name];
    console.log(stateChanger);
    if (stateChanger) {
      stateChanger(newMatrix, () =>
        console.log(matrix, 'matrix after state change')
      );
    }
  };

  const Grid = ({
    matrix,
    handleChange,
  }: {
    matrix: Matrix;
    handleChange: any;
  }) => {
    return (
      <div className='flex'>
        {matrix[0] && matrix[0].length > 0 && (
          <div
            className={`border grid ${getRowsClassName(
              matrix
            )} ${getColsClassName(matrix)}`}
          >
            {matrix.map((row, rowIdx) =>
              row.map((value, colIdx) => (
                <Cell
                  key={`${rowIdx}-${colIdx}`}
                  onChange={(e) => {
                    handleChange(matrix, colIdx, rowIdx, e.target.value);
                  }}
                  value={value}
                  placeholder={`${rowIdx}-${colIdx}`}
                />
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const Cell = ({
    onChange,
    value,
    placeholder,
  }: {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    value: number;
    placeholder: string;
  }) => {
    return (
      <div className='border flex'>
        <input
          type='number'
          onChange={onChange}
          placeholder={placeholder}
          value={value}
        />
      </div>
    );
  };

  useEffect(() => {
    CheckMatrixShapes(B, C);
    setMatrix1(generateMatrixArray(A, B, () => null));
    setMatrix2(generateMatrixArray(C, D, () => null));
  }, [A, B, C, D]);

  const handleSubmit = () => {
    if (canMultiply) {
      console.log('multiplication successful');
    } else {
      console.log('not compatible');
    }
  };
  return (
    <div className=''>
      <div className='flex flex-row justify-center gap-x-6'>
        <div className='grid grid-rows-2 w-1/2'>
          <div className='flex flex-row gap-x-1 justify-center'>
            <input
              type='number'
              onChange={(e) => setA(parseInt(e.target.value))}
              className='border'
            />
            <input
              type='number'
              onChange={(e) => setB(parseInt(e.target.value))}
              className='border'
            />
          </div>
          <div className='flex justify-center gap-x-5'>
            {<Grid matrix={matrix1} handleChange={handleChange} />}
          </div>
        </div>
        <div className='grid grid-rows-2'>
          <div className='border flex flex-row gap-x-1'>
            <input
              type='number'
              onChange={(e) => setC(parseInt(e.target.value))}
              className=''
            />
            x
            <input
              type='number'
              onChange={(e) => setD(parseInt(e.target.value))}
              className=''
            />
          </div>
          <div>
            <div className='flex justify-center gap-x-5'>
              {<Grid matrix={matrix2} handleChange={handleChange} />}
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center mt-10 gap-x-2'>
        <button type='submit' className='border' onClick={handleSubmit}>
          Submit
        </button>
        {A}x{B} {C}x{D}
      </div>
      <NotCompatible canMultiply={canMultiply} />
    </div>
  );
}

export default App;
