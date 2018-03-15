from rest_framework.views import APIView
from dynamo.models import Appmodel, Model, Field, Setting
from dynamo import utils
from dynamo.utils import ManageDB
from rest_framework.response import Response
from rest_framework import status
import json


# Create your views here.
class CreateUserTables(APIView):
    def post(self, request, format=None):
        try:
            risktypemodel = json.loads(request.body.decode("utf-8"))
            risktype = risktypemodel['RiskType']
            varFields = risktypemodel['Fields']
            if risktype is None or varFields is None:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            apps = Appmodel.objects.get(name='dynamostore')
            mods = Model(app=apps, name=risktype)
            mods.save()
            for vrec in varFields:
                fds = Field(model=mods, name=vrec['name'], type=vrec['type'])
                fds.save()
                if vrec['options'].strip() != '':
                    opt = vrec['options'].split(',')
                    for dat in opt:
                        namvalue = dat.split('=')[1].strip()
                        if (dat.split('=')[0].strip().lower() == 'choices'):
                            namvalue = dat.split('=')[1].strip().replace("|",',').replace(";",',')
                        sett = Setting(field=fds, name=dat.split('=')[0].strip(), value=namvalue)
                        sett.save()
            nwmod = Model.objects.get(id=mods.id)
            nwmodel = nwmod.get_dynamic_model()
            ManageDB.install(nwmodel)
            return Response("Record was Created successfully", status=status.HTTP_200_OK)
        except Model.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class singleRiskTypeDetails(APIView):
    def get(self, request, format=None):
        try:
            respJsonList = []
            risktype = self.request.query_params.get('TableName', None)
            respJson = getRiskType(risktype)
            respJsonList.append(respJson)
            return Response(respJsonList)
        except Model.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class allRiskTypeDetailsList(APIView):
    def get(self, request, format=None):
        try:
            respJsonList = []
            riskmodel = Model.objects.all()
            for rskmodel in riskmodel:
                respJsonList.append(getRiskType(rskmodel.name))
            return Response(respJsonList)
        except Model.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


def getRiskType(risktype):
    riskmodel = Model.objects.get(name=risktype)
    Fieldqset = Field.objects.filter(model_id=riskmodel.id).order_by('id')
    respJson = {'RiskType': riskmodel.name, 'Fields': []}
    respfields = []
    for fld in Fieldqset:
        fieldoptions = ''
        defval = ''
        varchoices = ''
        for frow in Setting.objects.filter(field_id=fld.id):
            if (frow.name.lower() == 'default'):
                defval = frow.value
            if (frow.name.lower() == 'choices'):
                varchoices = frow.value.replace("'", '').replace(" ", '').replace("),",';').replace("(",'').replace(")",'').replace(",",'|')
                frow.value = varchoices
            fieldoptions += frow.name + '=' + frow.value + ','
        if (varchoices.strip() != ''):
            defval = getdefaultValue(varchoices.strip(), defval)
        fldJson = {'name': fld.name, 'type': fld.type, 'fvalue': defval, 'options': fieldoptions.strip()[:-1]}
        respfields.append(fldJson)
    respJson['Fields'] = respfields
    return respJson


def getdefaultValue(vchoice, dfval):
    choicearray = vchoice.__str__().split(";")
    for eachval in choicearray:
        if (len(eachval.strip()) > 0):
            fldkey = eachval.split('|')[0].strip().lower()
            fldval = eachval.split('|')[1].strip()
            fldcomp = dfval.strip().lower()
            if (fldkey == fldcomp):
                return fldval
                break;
    return ''
