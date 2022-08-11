import { useCallback } from 'react';
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
  const [resultMatrix, setResultMatrix] = useState<Matrix>([[0]]);

  const CheckMatrixShapes = useCallback(
    (Matrix1Columns: number, Matrix2Rows: number) => {
      // console.log(Matrix1Columns, Matrix2Rows)
      if (Matrix1Columns === Matrix2Rows) {
        setCanMultiply(true);
      } else {
        setCanMultiply(false);
      }
      setResultMatrix(generateMatrixArray(A, D, () => null));
    },
    [A, D]
  );

  const generateMatrixArray = (rows: number, columns: number, mapper: any) => {
    return Array(rows)
      .fill(undefined)
      .map(() => Array(columns).fill(undefined).map(mapper)) as Matrix;
  };

  const dotProduct = (
    matrix1: Matrix,
    matrix2: Matrix,
    resultMatrix: Matrix
  ) => {
    let newResultMatrix = [...resultMatrix];
    for (let i = 0; i < matrix1.length; i++) {
      for (let j = 0; j < matrix2[0].length; j++) {
        for (let k = 0; k < matrix1[0].length; k++) {
          newResultMatrix[i][j] += matrix1[i][k] * matrix2[k][j];
        }
      }
    }
    setResultMatrix(newResultMatrix);
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
      // @ts-ignore
      stateChanger(newMatrix, () =>
        console.log(matrix, 'matrix after state change')
      );
    }
  };

  const Grid = ({
    matrix,
    handleChange,
    readOnly,
  }: {
    matrix: Matrix;
    handleChange: any;
    readOnly: boolean;
  }) => {
    return (
      <div className='flex'>
        {matrix[0] && matrix[0].length > 0 && (
          <div
            className={`border grid overflow-hidden ${getRowsClassName(
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
                  readOnly={readOnly}
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
    readOnly,
  }: {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    value: number;
    placeholder: string;
    readOnly: boolean;
  }) => {
    return (
      <div className='border flex aspect-square'>
        <input
          type='number'
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          className='text-center overflow-hidden'
          readOnly={readOnly}
        />
      </div>
    );
  };

  useEffect(() => {
    CheckMatrixShapes(B, C);
  }, [CheckMatrixShapes, A, B, C, D]);

  useEffect(() => {
    setMatrix1(generateMatrixArray(A, B, () => null));
  }, [A, B]);

  useEffect(() => {
    setMatrix2(generateMatrixArray(C, D, () => null));
  }, [C, D]);

  const handleSubmit = () => {
    if (canMultiply) {
      dotProduct(matrix1, matrix2, resultMatrix);
    }
  };
  return (
    <div className='max-h-screen'>
      <div className='flex justify-center gap-x-6 h-50'>
        <div className='w-2/5 flex flex-col'>
          <div className='flex flex-row gap-x-5 justify-center m-4 h-12'>
            <input
              type='number'
              onChange={(e) => setA(Math.abs(parseInt(e.target.value)))}
              className='border aspect-square text-center'
              min='0'
              max='12'
              step='1'
            />
            <div className='flex items-center'>x</div>
            <input
              type='number'
              onChange={(e) => setB(Math.abs(parseInt(e.target.value)))}
              className='border aspect-square text-center'
              min='0'
              max='12'
              step='1'
            />
          </div>
          <div className='flex justify-center px-12'>
            {
              <Grid
                matrix={matrix1}
                handleChange={handleChange}
                readOnly={false}
              />
            }
          </div>
        </div>
        <div className='w-1/5 flex flex-col'>
          <div className='m-4 flex flex-col justify-center'>
            <button type='submit' className='border' onClick={handleSubmit}>
              Submit
            </button>
            <div className='text-center'>
              <NotCompatible canMultiply={canMultiply} />
            </div>
          </div>
        </div>
        <div className='w-2/5 flex flex-col'>
          <div className='flex flex-row gap-x-5 justify-center m-4 h-12'>
            <input
              type='number'
              onChange={(e) => setC(Math.abs(parseInt(e.target.value)))}
              className='border aspect-square text-center'
              min='0'
              max='12'
              step='1'
            />
            <div className='flex items-center'>x</div>
            <input
              type='number'
              onChange={(e) => setD(Math.abs(parseInt(e.target.value)))}
              className='border aspect-square text-center'
              max='12'
              min='0'
              step='1'
            />
          </div>
          <div>
            <div className='flex justify-center px-12'>
              {
                <Grid
                  matrix={matrix2}
                  handleChange={handleChange}
                  readOnly={false}
                />
              }
            </div>
          </div>
        </div>
      </div>

      {canMultiply && (
        <div className='mt-4'>
          <div className='flex justify-center px-12 w-1/2 mx-auto'>
            <Grid
              matrix={resultMatrix}
              handleChange={handleChange}
              readOnly={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
