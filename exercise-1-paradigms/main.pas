program Paradigms;

uses crt;

const
  MAX_SIZE = 50;

type
  TArray = array[1..MAX_SIZE] of Integer;

var
  numbers: TArray;
  
procedure GenerateRandomNumbers(var arr: TArray; fromValue, toValue: Integer; count: Integer);
var
  i: Integer;
begin
  Randomize;
  for i := 1 to count do
    arr[i] := Random(toValue - fromValue + 1) + fromValue;
end;

procedure SortNumbers(var arr: TArray; count: Integer);
var
  i, j, temp: Integer;
begin
  for i := 1 to count - 1 do
    for j := 1 to count - i do
      if arr[j] > arr[j + 1] then
      begin
        temp := arr[j];
        arr[j] := arr[j + 1];
        arr[j + 1] := temp;
      end;
end;

procedure PrintArray(arr: TArray; count: Integer);
var
  i: Integer;
begin
  for i := 1 to count do
    Write(arr[i], ' ');
  WriteLn;
end;

begin
  GenerateRandomNumbers(numbers, 0, 100, MAX_SIZE);
  
  WriteLn('Numbers before sorting:');
  PrintArray(numbers, MAX_SIZE);

  SortNumbers(numbers, MAX_SIZE);

  WriteLn('Numbers after sorting:');
  PrintArray(numbers, MAX_SIZE);
end.
