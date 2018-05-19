create or replace package PKG_MKB10 is
       function FIND_CLASS_BY_CODE (CODE in VARCHAR2) return NUMBER;
end PKG_MKB10;

create or replace package body PKG_MKB10 is

       function FIND_CLASS_BY_CODE(CODE in VARCHAR2) 
                return NUMBER
       is
                CODE_SYMB VARCHAR2(5);
                CODE_NUMB NUMBER;
                
                CLASS_ID NUMBER := 0;
                
                TEMP_CODE_FROM VARCHAR2(5);
                TEMP_NUMB_FROM NUMBER;
                TEMP_CODE_TO VARCHAR2(5);
                TEMP_NUMB_TO NUMBER;
       begin
         CODE_SYMB := substr(CODE, 1, 1);
         CODE_NUMB := to_number(substr(CODE, 2), '99.9');

         for v in (select mc.ID,
                          mc.CODE_FROM,
                          mc.CODE_TO
                     from MKB_CLASSES mc) loop
                     
             
            TEMP_CODE_FROM := substr(v.CODE_FROM, 1, 1);
            TEMP_CODE_TO := substr(v.CODE_TO, 1, 1);
            TEMP_NUMB_FROM :=  substr(v.CODE_FROM, 2);
            TEMP_NUMB_TO :=  substr(v.CODE_TO, 2);
            
            
            if CODE_SYMB >= TEMP_CODE_FROM and CODE_SYMB <= TEMP_CODE_TO then
               if CODE_SYMB < TEMP_CODE_TO then
                  if CODE_NUMB >= TEMP_NUMB_FROM or CODE_SYMB != TEMP_CODE_FROM then
                     CLASS_ID := v.ID;
                  else 
                     CLASS_ID := 0;
                  end if;
               else 
                 if CODE_NUMB <= TEMP_NUMB_TO then
                    CLASS_ID := v.ID;
                 else 
                    CLASS_ID := 0;
                 end if;
               end if;
            end if;
         end loop;
         
         return CLASS_ID;
       exception when no_data_found then
           return 0;
       end FIND_CLASS_BY_CODE;
end PKG_MKB10;
