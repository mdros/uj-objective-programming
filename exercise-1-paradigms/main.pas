program Paradigms;

uses
    SysUtils;

procedure GenerateRandomNumbers;
var
    i, randomNumber: Integer;
begin
    Randomize;
    for i := 1 to 50 do
    begin
        randomNumber := Random(101);
        WriteLn('Random Number ', i, ': ', randomNumber);
    end;
end;

begin
    WriteLn('Generating 50 random numbers in range 0 to 100:');
    GenerateRandomNumbers;
end.